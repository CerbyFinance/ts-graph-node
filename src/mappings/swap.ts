import { Swap as SwapEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, Swap, Transaction } from '../types/schema';
import { calculatePoolPrice, ZERO_BI } from './helpers';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { getOrCreateTransaction } from './transaction';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { addFees, addTVL, removeTVL } from './snapshots/global/Global';

export function handleSwap(Event: SwapEvent): void {
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
    }

    pool.balanceToken = pool.balanceToken.plus(Event.params._amountTokensIn).minus(Event.params._amountTokensOut);
    pool.balanceCerUsd = pool.balanceCerUsd.plus(Event.params._amountCerUsdIn).minus(Event.params._amountCerUsdOut);
    calculatePoolPrice(pool);
    pool.save()

    let swap = new Swap(Event.block.hash.toHexString() +
    "-" +
    Event.transaction.hash.toHexString() +
    "-" +
    Event.logIndex.toHexString());

    if(Event.params._amountCerUsdOut.equals(ZERO_BI)) {
        swap.feedType =  'buy';

        swap.amountTokensIn  = Event.params._amountCerUsdIn;
        swap.amountTokensOut = Event.params._amountTokensOut;
        addTVL(Event.params._amountCerUsdIn, Event.block.timestamp);
    } else {
        swap.feedType =  'sell';
        swap.amountTokensIn  = Event.params._amountTokensIn;
        swap.amountTokensOut = Event.params._amountCerUsdOut;
        removeTVL(Event.params._amountCerUsdOut, Event.block.timestamp)
    }

    const FEE_DENORM = BigInt.fromI32(10000);

    swap.currentFee = Event.params._currentFee.divDecimal(FEE_DENORM.toBigDecimal());

    addFees(swap.currentFee, Event.block.timestamp);

    swap.amountFeesCollected = (swap.amountTokensIn.times(Event.params._currentFee)).div(FEE_DENORM)

    swap.price = pool.price;

    swap.transaction = getOrCreateTransaction(Event);

    swap.token = Event.params._token.toHexString();
    swap.sender = Event.params._sender;
    swap.to = Event.params._transferTo;

    // createSnapshot({
    //     price: pool.price,
    //     blockTimestamp: Event.block.timestamp,
    //     token: Event.params.token,
    //     Trade: {
    //         CerUsd: Event.params.amountCerUsdIn.plus(Event.params.amountCerUsdOut),
    //         Token: Event.params.amountTokensIn.plus(Event.params.amountTokensOut)
    //     },
    //     syncLiqudity: {
    //         CerUsd: ZERO_BI,
    //         Token: ZERO_BI
    //     }
    // })


    createPoolSnapshot(
        Event.params._token, // Token address
        pool.price, // Price
        Event.block.timestamp, // StartUnix

        // Liqudity
        ZERO_BI,
        ZERO_BI,

        // Trade
        Event.params._amountCerUsdIn.plus(Event.params._amountCerUsdOut),
        Event.params._amountTokensIn.plus(Event.params._amountTokensOut),
        swap.amountFeesCollected
    )


    // swap.transactionFee = Event.params.currentFee;

    swap.save();
}