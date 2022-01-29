import { PairCreated as PairEvent } from '../types/CerbySwap/CerbySwap';
import { log, BigInt } from '@graphprotocol/graph-ts'
import { Pool } from '../types/schema'
import { calculatePoolPrice, ZERO_BI, ZERO_BD } from './helpers';
import { ERC20 } from '../types/CerbySwap/ERC20';
import { getOrCreateTransaction } from './transaction';
import { addPool, createOrLoadGlobal } from './snapshots/global/Global';

export function PairCreated(Event: PairEvent): void {
    let pool = new Pool(Event.params.token.toHexString());

    pool.poolId = Event.params.poolId;
    pool.token = Event.params.token;

    pool.balanceCerUsd = ZERO_BI;
    pool.balanceToken = ZERO_BI;


    let decimals = ERC20.bind(Event.params.token).try_decimals();
    if(decimals != null && !decimals.reverted && 6 <= decimals.value && decimals.value <= 18) {
        pool.decimals = decimals.value;
    } else {
        pool.decimals = 18;
    }

    let symbol = ERC20.bind(Event.params.token).try_symbol();
    if(symbol != null && !symbol.reverted) {
        pool.symbol = symbol.value;
    } else {
        pool.symbol = 'unknown';
    }

    let name = ERC20.bind(Event.params.token).try_name();
    if(name != null && !name.reverted) {
        pool.name = name.value;
    } else {
        pool.name = 'unknown';
    }

    pool.transaction = getOrCreateTransaction(Event);

    calculatePoolPrice(pool);
    pool.save();

    addPool(1, Event.block.timestamp);
}