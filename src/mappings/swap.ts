import { Swap as SwapEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, Swap, Transaction } from '../types/schema';
import { calculatePoolPrice, ZERO_BI } from './helpers';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { getOrCreateTransaction } from './transaction';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { addFees, addTVL, removeTVL } from './snapshots/global/Global';

export function handleSwap(Event: SwapEvent): void {
    let pool = Pool.load(Event.params.token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params.token.toHexString())
    }



    pool.balanceToken = pool.balanceToken.plus(Event.params.amountTokensIn).minus(Event.params.amountTokensOut);
    pool.balanceCerUsd = pool.balanceCerUsd.plus(Event.params.amountCerUsdIn).minus(Event.params.amountCerUsdOut);
    calculatePoolPrice(pool);
    pool.save()

    let swap = new Swap(Event.block.hash.toHexString() +
    "-" +
    Event.transaction.hash.toHexString() +
    "-" +
    Event.logIndex.toHexString());

    if(Event.params.amountCerUsdOut.equals(ZERO_BI)) {
        swap.feedType =  'buy';

        swap.amountTokensIn  = Event.params.amountCerUsdIn;
        swap.amountTokensOut = Event.params.amountTokensOut;
        addTVL(Event.params.amountCerUsdIn, Event.block.timestamp);
    } else {
        swap.feedType =  'sell';
        swap.amountTokensIn  = Event.params.amountTokensIn;
        swap.amountTokensOut = Event.params.amountCerUsdOut;
        removeTVL(Event.params.amountCerUsdOut, Event.block.timestamp)
    }

    const FEE_DENORM = BigInt.fromI32(10000);

    swap.currentFee = Event.params.currentFee.divDecimal(FEE_DENORM.toBigDecimal());

    addFees(swap.currentFee, Event.block.timestamp);

    swap.amountFeesCollected = (swap.amountTokensIn.times(Event.params.currentFee)).div(FEE_DENORM)

    swap.price = pool.price;

    swap.transaction = getOrCreateTransaction(Event);

    swap.token = Event.params.token;
    swap.sender = Event.params.sender;
    swap.to = Event.params.transferTo;

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
        Event.params.token, // Token address
        pool.price, // Price
        Event.block.timestamp, // StartUnix

        // Liqudity
        ZERO_BI,
        ZERO_BI,

        // Trade
        Event.params.amountCerUsdIn.plus(Event.params.amountCerUsdOut),
        Event.params.amountTokensIn.plus(Event.params.amountTokensOut),
        swap.amountFeesCollected
    )


    // swap.transactionFee = Event.params.currentFee;

    swap.save();
}

