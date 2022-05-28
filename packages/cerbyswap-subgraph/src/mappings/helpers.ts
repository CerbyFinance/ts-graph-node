import { BigDecimal, BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import { CerbyToken, Pool, poolDaily } from "../types/schema";
import { ERC20 } from "../types/CerbySwap/ERC20";
import { ERC20SymbolBytes } from '../types/CerbySwap/ERC20SymbolBytes';
import { ERC20NameBytes } from '../types/CerbySwap/ERC20NameBytes';
import { TokenDefinition } from './tokenDefinition'

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let BI_51 = BigInt.fromI32(51);
export let ZERO_BD = BigDecimal.fromString("0");
export let ONE_BD = BigDecimal.fromString("1");
export let BI_18 = BigInt.fromI32(18);
export let BI_12 = BigInt.fromI32(12);
export let BI_6 = BigInt.fromI32(6);
export let BI_1312 = BigInt.fromI32(1312);


// function should_ignore(tmp) {
//     return tmp && tmp.length == 1 && (tmp = tmp.charCodeAt(0)) >= 0xd800 && tmp < 0xdc00;
// }

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString("1");
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString("10"));
  }
  return bd;
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt,
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function getStablePool(): Pool | null {
  // In the case of adding stable pool switching, you need to replace 0 with a variable.
  // And add other stablecoins to the poolCreated handler.
  const maybeStablePool = CerbyToken.load((0).toString())
  if(maybeStablePool) {
    const stablePool = Pool.load(maybeStablePool.stablePool);
    if(stablePool) {
      return stablePool
    }
  }
  return null;
}

export function getCerbyPrice(): BigDecimal | null {
  const stablePool = getStablePool();
  if(stablePool) {
    return stablePool.price;
  } else {
    return null;
  }
}

export function calculatePoolPrice(pool: Pool): void {
    if(pool.balanceCerby > ZERO_BI) {
        pool.price = pool.balanceCerby.divDecimal(pool.balanceToken.toBigDecimal());
    } else {
        pool.price = ZERO_BD;
    }
    const stablePool = getStablePool();
    if(stablePool) {
      if(stablePool.id == pool.id) {
        pool.priceUSD = BigDecimal.fromString('1');
      } else {
        if(stablePool.price) {
          pool.priceUSD = pool.price.times(stablePool.price);
        } else {
          pool.priceUSD = ZERO_BD;
        }
      }
    }

    
    // pool.symbol = 'unknown';
    // if(!pool.name) {
    //     pool.name = fetchTokenName(Address.fromHexString(pool.token.toHexString()) as Address)
    // }
    // if(!pool.decimals) {
    //     let decimals = fetchTokenDecimals(Address.fromHexString(pool.token.toHexString()) as Address)
    
    //     // bail if we couldn't figure out the decimals
    //     if (decimals === null) {
    //         pool.decimals = ZERO_BI;
    //         return
    //     }
    //     pool.decimals = decimals
    // }
}


export function fetchTokenSymbol(tokenAddress: Address): string {
    // static definitions overrides
    let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
    if(staticDefinition != null) {
      return (staticDefinition as TokenDefinition).symbol
    }
  
    let contract = ERC20.bind(tokenAddress)
    let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress)
  
    // try types string and bytes32 for symbol
    let symbolResult = contract.try_symbol()!
    if (symbolResult && symbolResult.reverted) {
      let symbolResultBytes = contractSymbolBytes.try_symbol()!
      if (symbolResult && symbolResultBytes && !symbolResultBytes.reverted) {
        // for broken pairs that have no symbol function exposed
        if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
            return symbolResultBytes.value.toString()
        }
      }
    } else if(symbolResult && symbolResult.value) {
        return symbolResult.value
    }
  
    return 'unknown'
  }
  
  export function fetchTokenName(tokenAddress: Address): string {
    // static definitions overrides
    let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
    if(staticDefinition != null) {
      return (staticDefinition as TokenDefinition).name
    }
  
    let contract = ERC20.bind(tokenAddress)
    let contractNameBytes = ERC20NameBytes.bind(tokenAddress)
  
    // try types string and bytes32 for name
    let nameValue = 'unknown'
    let nameResult = contract.try_name()
    if (nameResult.reverted) {
      let nameResultBytes = contractNameBytes.try_name()
      if (!nameResultBytes.reverted) {
        // for broken exchanges that have no name function exposed
        if (!isNullEthValue(nameResultBytes.value.toHexString())) {
          nameValue = nameResultBytes.value.toString()
        }
      }
    } else {
      nameValue = nameResult.value
    }
  
    return nameValue
  }
  
  export function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
    let contract = ERC20.bind(tokenAddress)
    let totalSupplyValue = null
    let totalSupplyResult = contract.try_totalSupply()
    if (!totalSupplyResult.reverted) {
      totalSupplyValue = totalSupplyResult as i32
    }
    return BigInt.fromI32(totalSupplyValue as i32)
  }
  
  export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    // static definitions overrides
    // let staticDefinition = TokenDefinition.fromAddress(tokenAddress)
    // if(staticDefinition != null) {
    //   return (staticDefinition as TokenDefinition).decimals
    // }
  
    let contract = ERC20.bind(tokenAddress)
    // try types uint8 for decimals
    let decimalValue = null
    let decimalResult = contract.try_decimals()
    if (!decimalResult.reverted) {
      decimalValue = decimalResult.value
    }
    return BigInt.fromI32(decimalValue as i32)
  }

export function isNullEthValue(value: string): boolean {
    return value == '0x0000000000000000000000000000000000000000000000000000000000000001'
}

export function isUSD(address: Address): boolean {
  const ethUSDC  = Address.fromHexString('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
  const bscUSDC  = Address.fromHexString('0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d');
  const ftmUSDC  = Address.fromHexString('0x04068DA6C83AFCFA0e13ba15A6696662335D5B75');
  const polyUSDC = Address.fromHexString('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
  const avaxUSDC = Address.fromHexString('0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E');
  const testUSDC = Address.fromHexString('0x3b1dd4b62c04e92789aafef24af74beeb5006395');

  return address.equals(ethUSDC)
      || address.equals(bscUSDC)
      || address.equals(ftmUSDC)
      || address.equals(polyUSDC)
      || address.equals(avaxUSDC)
      || address.equals(testUSDC);
}