import { Swap as SwapEvent } from '../types/CerbySwap/CerbySwap';
import { Pool, Swap, Transaction } from '../types/schema';
import { BI_18, calculatePoolPrice, convertTokenToDecimal, exponentToBigDecimal, getCerbyPrice, getStablePool, ZERO_BD, ZERO_BI } from './helpers';
import { createPoolSnapshot } from './snapshots/pool/snapshot';
import { CreatePoolTransaction, getOrCreateTransaction } from './transaction';
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { addFees, addTVL, removeTVL } from './snapshots/global/Global';

export function handleSwap(Event: SwapEvent): void {
    let pool = Pool.load(Event.params._token.toHexString());
    if(!pool) {
        pool = new Pool(Event.params._token.toHexString())
    }

    pool.balanceToken = pool.balanceToken.plus(Event.params._amountTokensIn).minus(Event.params._amountTokensOut);
    pool.balanceCerby = pool.balanceCerby.plus(Event.params._amountCerbyIn).minus(Event.params._amountCerbyOut);
    calculatePoolPrice(pool);
    pool.save();

    let swap = new Swap(Event.block.hash.toHexString() +
    "-" +
    Event.transaction.hash.toHexString() +
    "-" +
    Event.logIndex.toHexString());

    const stablePool = getStablePool();

    if(Event.params._amountCerbyOut.equals(ZERO_BI)) {
        swap.feedType = 'buy';

        swap.amountTokensIn  = Event.params._amountCerbyIn;
        swap.amountTokensOut = Event.params._amountTokensOut;
        addTVL(Event.params._amountCerbyIn, Event.block.timestamp);
    } else {
        swap.feedType = 'sell';
        swap.amountTokensIn  = Event.params._amountTokensIn;
        swap.amountTokensOut = Event.params._amountCerbyOut;
        removeTVL(Event.params._amountCerbyOut, Event.block.timestamp)
    }

    let priceUSDPerCerby: BigDecimal | null;
    if(stablePool) {
        priceUSDPerCerby = stablePool.price;
        const amountCerby = convertTokenToDecimal(Event.params._amountCerbyIn.plus(Event.params._amountCerbyOut), BI_18);
        if(stablePool.id == pool.id) {
            swap.amountUSD = amountCerby;
            swap.priceUSD = BigDecimal.fromString('1');
        } else {
            swap.amountUSD = amountCerby.div(stablePool.price);
            swap.priceUSD = pool.priceUSD;
        }
    } else {
        priceUSDPerCerby = null;
    }

    const FEE_DENORM = BigInt.fromI32(10000);

    swap.currentFee = Event.params._currentFee.divDecimal(FEE_DENORM.toBigDecimal());

    addFees(swap.currentFee, Event.block.timestamp);

    swap.amountFeesCollected = (swap.amountTokensIn.times(Event.params._currentFee)).div(FEE_DENORM)

    // swap.priceUSD = pool.price;
    swap.price = pool.price;

    swap.transaction = getOrCreateTransaction(Event);
    CreatePoolTransaction(pool.id, swap.transaction, Event);

    swap.token = Event.params._token.toHexString();
    swap.sender = Event.params._sender;
    swap.to = Event.params._transferTo;
    swap.logIndex = Event.logIndex;

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

    swap.save();

    createPoolSnapshot(
        Event.params._token, // Token address
        pool.price, // Price
        priceUSDPerCerby, // PriceUSD
        Event.block.timestamp, // StartUnix

        // Liqudity
        ZERO_BI,
        ZERO_BI,

        // Trade
        Event.params._amountCerbyIn.plus(Event.params._amountCerbyOut),
        Event.params._amountTokensIn.plus(Event.params._amountTokensOut),
        swap.amountFeesCollected,
        swap.amountUSD
    )
}