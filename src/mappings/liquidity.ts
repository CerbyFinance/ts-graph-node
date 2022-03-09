import { LiquidityAdded as AddedEvent, LiquidityRemoved as RemovedEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, liqudityEvent } from '../types/schema';
import { calculatePoolPrice, fetchTokenDecimals, ZERO_BI } from './helpers';
import { getOrCreateTransaction } from './transaction';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { addTVL, removeTVL } from './snapshots/global/Global';


export function LiquidityAdded(Event: AddedEvent): void {
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
    }
    pool.balanceToken = pool.balanceToken.plus(Event.params._amountTokensIn);
    pool.balanceCerUsd = pool.balanceCerUsd.plus(Event.params._amountCerUsdToMint);

    calculatePoolPrice(pool);
    pool.save()

    let liqudity = new liqudityEvent(Event.transaction.hash.toHexString());
    liqudity.token = Event.params._token.toHexString();

    liqudity.feedType = 'add';

    liqudity.amountTokens = Event.params._amountTokensIn;
    liqudity.amountCerUsd = Event.params._amountCerUsdToMint;

    liqudity.amountLpTokensBalanceToBurn = Event.params._lpAmount;

    liqudity.transaction = getOrCreateTransaction(Event);

    addTVL(Event.params._amountCerUsdToMint, Event.block.timestamp);


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
        Event.params._token, // Token address
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
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
        return
    }
    pool.balanceToken = pool.balanceToken.minus(Event.params._amountTokensOut);
    pool.balanceCerUsd = pool.balanceCerUsd.minus(Event.params._amountCerUsdToBurn);

    calculatePoolPrice(pool);
    pool.save()
    

    let liqudity = new liqudityEvent(Event.transaction.hash.toHexString());
    liqudity.token = Event.params._token.toHexString();

    liqudity.feedType = 'remove';

    liqudity.amountTokens = Event.params._amountTokensOut;
    liqudity.amountCerUsd = Event.params._amountCerUsdToBurn;

    liqudity.amountLpTokensBalanceToBurn = Event.params._amountLpTokensBalanceToBurn;

    liqudity.transaction = getOrCreateTransaction(Event);

    removeTVL(Event.params._amountCerUsdToBurn, Event.block.timestamp);

    createPoolSnapshot(
        Event.params._token, // Token address
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