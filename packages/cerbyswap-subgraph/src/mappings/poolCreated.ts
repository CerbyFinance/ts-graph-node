import { PoolCreated as PoolEvent } from '../types/CerbySwap/CerbySwap';
import { Pool } from '../types/schema'
import { calculatePoolPrice, ZERO_BI, ZERO_BD, isUSD } from './helpers';
import { ERC20 } from '../types/CerbySwap/ERC20';
import { CerbySwap } from '../types/CerbySwap/CerbySwap';
import { getOrCreateTransaction } from './transaction';
import { addPool, createOrLoadGlobal } from './snapshots/global/Global';
import { Address,  } from '@graphprotocol/graph-ts';
import { CerbyToken } from '../types/schema';

export function PoolCreated(Event: PoolEvent): void {
    const pool = new Pool(Event.params._token.toHexString());

    pool.poolId = Event.params._poolId;
    pool.token = Event.params._token;
    pool.vaultAddress = Event.params._vaultAddress;

    pool.balanceCerby = ZERO_BI;
    pool.balanceToken = ZERO_BI;


    const decimals = ERC20.bind(Event.params._token).try_decimals();
    if(decimals != null && !decimals.reverted && 6 <= decimals.value && decimals.value <= 18) {
        pool.decimals = decimals.value;
    } else {
        pool.decimals = 18;
    }

    const symbol = ERC20.bind(Event.params._token).try_symbol();
    if(symbol != null && !symbol.reverted) {
        pool.symbol = symbol.value;
    } else {
        pool.symbol = 'UNK';
    }

    const name = ERC20.bind(Event.params._token).try_name();
    if(name != null && !name.reverted) {
        pool.name = name.value;
    } else {
        pool.name = 'unknown';
    }

    pool.transaction = getOrCreateTransaction(Event);

    calculatePoolPrice(pool);
    pool.save();

    addPool(1, Event.block.timestamp);

    if(isUSD(Event.params._token)) {
        for(let i = 0;;i++) {
            const maybeCerbyBind = CerbyToken.load(i.toString());
            if(!maybeCerbyBind) {
                const newCerbyBindUsd = new CerbyToken(i.toString());
                newCerbyBindUsd.stablePool = pool.id;
                newCerbyBindUsd.save();
                break;
            }
        }
    }
}