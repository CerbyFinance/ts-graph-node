import { LiquidityAdded as AddedEvent, LiquidityRemoved as RemovedEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, liqudityEvent } from '../types/schema';
import { BI_18, calculatePoolPrice, convertTokenToDecimal, fetchTokenDecimals, getCerbyPrice, ZERO_BD, ZERO_BI } from './helpers';
import { getOrCreateTransaction, CreatePoolTransaction } from './transaction';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { addTVL, removeTVL } from './snapshots/global/Global';


export function LiquidityAdded(Event: AddedEvent): void {
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
    }
    pool.balanceToken = pool.balanceToken.plus(Event.params._amountTokensIn);
    pool.balanceCerby = pool.balanceCerby.plus(Event.params._amountCerbyToMint);

    calculatePoolPrice(pool);
    pool.save()

    let liqudity = new liqudityEvent(Event.block.hash.toHexString() +
        "-" +
        Event.transaction.hash.toHexString() +
        "-" +
        Event.logIndex.toHexString());

    liqudity.token = Event.params._token.toHexString();

    liqudity.feedType = 'add';

    liqudity.amountTokens = Event.params._amountTokensIn;
    liqudity.amountCerby = Event.params._amountCerbyToMint;

    const price = getCerbyPrice();
    if(price) {
        liqudity.amountUSD = convertTokenToDecimal(liqudity.amountCerby, BI_18).div(price);
    } else {
        liqudity.amountUSD = ZERO_BD;
    }

    liqudity.amountLpTokensBalanceToBurn = Event.params._lpAmount;

    liqudity.transaction = getOrCreateTransaction(Event);

    CreatePoolTransaction(pool.id, liqudity.transaction, Event);

    addTVL(Event.params._amountCerbyToMint, Event.block.timestamp);


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
        price,
        Event.block.timestamp, // StartUnix

        // Liqudity
        pool.balanceCerby,
        pool.balanceToken,

        // Trade
        ZERO_BI,
        ZERO_BI,
        ZERO_BI,
        ZERO_BD
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
    pool.balanceCerby = pool.balanceCerby.minus(Event.params._amountCerbyToBurn);

    calculatePoolPrice(pool);
    pool.save()
    

    let liqudity = new liqudityEvent(Event.transaction.hash.toHexString());
    liqudity.token = Event.params._token.toHexString();

    liqudity.feedType = 'remove';

    liqudity.amountTokens = Event.params._amountTokensOut;
    liqudity.amountCerby = Event.params._amountCerbyToBurn;

    const price = getCerbyPrice();
    if(price) {
        liqudity.amountUSD = convertTokenToDecimal(liqudity.amountCerby, BI_18).div(price);
    } else {
        liqudity.amountUSD = ZERO_BD;
    }

    liqudity.amountLpTokensBalanceToBurn = Event.params._amountLpTokensBalanceToBurn;

    liqudity.transaction = getOrCreateTransaction(Event);

    liqudity.logIndex = Event.logIndex;

    removeTVL(Event.params._amountCerbyToBurn, Event.block.timestamp);

    createPoolSnapshot(
        Event.params._token, // Token address
        pool.price, // Price
        price,
        Event.block.timestamp, // StartUnix

        // Liqudity
        pool.balanceCerby,
        pool.balanceToken,

        // Trade
        ZERO_BI,
        ZERO_BI,
        ZERO_BI,
        ZERO_BD
    )

    liqudity.save();
}