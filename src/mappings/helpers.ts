import { BigDecimal, BigInt, Address } from "@graphprotocol/graph-ts";
import { Pool } from "../types/schema";
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

export function calculatePoolPrice(pool: Pool): void {
    if(pool.balanceCerUsd > ZERO_BI) {
        pool.price = pool.balanceCerUsd.divDecimal(pool.balanceToken.toBigDecimal());
    } else {
        pool.price = ZERO_BD;
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