import { LiquidityAdded as AddedEvent, LiquidityRemoved as RemovedEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, liqudityEvent } from '../types/schema';
import { calculatePoolPrice, fetchTokenDecimals, ZERO_BI } from './helpers';
import { getOrCreateTransaction } from './transaction';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { addTVL } from './snapshots/global/Global';


export function LiquidityAdded(Event: AddedEvent): void {
    let pool = Pool.load(Event.params.token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params.token.toHexString())
    }
    pool.balanceToken = pool.balanceToken.plus(Event.params.amountTokensIn);
    pool.balanceCerUsd = pool.balanceCerUsd.plus(Event.params.amountCerUsdToMint);

    calculatePoolPrice(pool);
    pool.save()

    let liqudity = new liqudityEvent(Event.transaction.hash.toHexString());
    liqudity.token = Event.params.token;

    liqudity.feedType = 'add';

    liqudity.amountTokens = Event.params.amountTokensIn;
    liqudity.amountCerUsd = Event.params.amountCerUsdToMint;

    liqudity.amountLpTokensBalanceToBurn = Event.params.lpAmount;

    liqudity.transaction = getOrCreateTransaction(Event);

    addTVL(Event.params.amountCerUsdToMint, Event.block.timestamp);


    // createPoolSnapshot({
    //     price: pool.price,
    //     blockTimestamp: Event.block.timestamp,
    //     token: Event.params.token,
    //     syncLiqudity: {
    //         CerUsd: pool.balanceCerUsd,
    //         Token: pool.balanceToken
    //     },
    //     Trade: {
    //         CerUsd: ZERO_BI,
    //         Token: ZERO_BI
    //     }
    // })

    createPoolSnapshot(
        Event.params.token, // Token address
        pool.price, // Price
        Event.block.timestamp, // StartUnix

        // Liqudity
        pool.balanceCerUsd,
        pool.balanceToken,

        // Trade
        ZERO_BI,
        ZERO_BI,
        ZERO_BI
    )

    liqudity.save();
}

export function LiquidityRemoved(Event: RemovedEvent): void {
    let pool = Pool.load(Event.params.token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params.token.toHexString())
        return
    }
    pool.balanceToken = pool.balanceToken.minus(Event.params.amountTokensOut);
    pool.balanceCerUsd = pool.balanceCerUsd.minus(Event.params.amountCerUsdToBurn);

    calculatePoolPrice(pool);
    pool.save()
    

    let liqudity = new liqudityEvent(Event.transaction.hash.toHexString());
    liqudity.token = Event.params.token;

    liqudity.feedType = 'remove';

    liqudity.amountTokens = Event.params.amountTokensOut;
    liqudity.amountCerUsd = Event.params.amountCerUsdToBurn;

    liqudity.amountLpTokensBalanceToBurn = Event.params.amountLpTokensBalanceToBurn;

    liqudity.transaction = getOrCreateTransaction(Event);

    addTVL(Event.params.amountCerUsdToBurn, Event.block.timestamp);

    createPoolSnapshot(
        Event.params.token, // Token address
        pool.price, // Price
        Event.block.timestamp, // StartUnix

        // Liqudity
        pool.balanceCerUsd,
        pool.balanceToken,

        // Trade
        ZERO_BI,
        ZERO_BI,
        ZERO_BI
    )

    liqudity.save();
}