import { Sync as SyncEvent } from '../types/CerbySwap/CerbySwap';
import { Pool } from '../types/schema';
import { calculatePoolPrice, ZERO_BD, ZERO_BI } from './helpers';

export function handleSync(Event: SyncEvent): void {
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
    }
    pool.balanceToken = Event.params._newBalanceToken;
    pool.balanceCerby = Event.params._newBalanceCerby;
    pool.CreditCerby = Event.params._newCreditCerby
    calculatePoolPrice(pool);

    // createSnapshot(
    //     Event.params.token, // Token address
    //     pool.price, // Price
    //     Event.block.timestamp, // StartUnix

    //     // Liqudity
    //     pool.balanceCerUsd,
    //     pool.balanceToken,

    //     // Trade
    //     ZERO_BI,
    //     ZERO_BI,
    //     ZERO_BI
    // )

    pool.save()
}