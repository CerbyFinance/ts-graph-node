import { BigInt, BigDecimal } from '@graphprotocol/graph-ts';
import { Global } from '../../../types/schema';
import { ZERO_BI, ZERO_BD } from '../../helpers';
import { hourlyGlobalSnapshot } from './hourly';
import { dailyGlobalSnapshot } from './daily';
import { monthlyGlobalSnapshot } from './monthly';


export function createOrLoadGlobal(): Global {
    let global = Global.load('1');
    if(global == null) {
        global = new Global('1');
        global.totalPools = ZERO_BI;
        global.totalTransactions = ZERO_BI;
        global.totalVolumeUSD = ZERO_BI;
        global.totalLiquidityUSD = ZERO_BI;
        global.Fees = ZERO_BD;
    }

    return global;
}

export function addPool(count: i32, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.totalPools = global.totalPools.plus(BigInt.fromI32(count));

    hourly.totalPools = global.totalPools;
    daily.totalPools = global.totalPools;
    monthly.totalPools = global.totalPools;

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}

export function addTransaction(count: i32, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.totalTransactions = global.totalTransactions.plus(BigInt.fromI32(count));

    hourly.totalTransactions = hourly.totalTransactions.plus(BigInt.fromI32(count));
    daily.totalTransactions = daily.totalTransactions.plus(BigInt.fromI32(count));
    monthly.totalTransactions = monthly.totalTransactions.plus(BigInt.fromI32(count));

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}

export function addVolumeUsd(volume: BigInt, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.totalVolumeUSD = global.totalVolumeUSD.plus(volume);

    hourly.totalVolumeUSD = hourly.totalVolumeUSD.plus(volume);
    daily.totalVolumeUSD = daily.totalVolumeUSD.plus(volume);
    monthly.totalVolumeUSD = monthly.totalVolumeUSD.plus(volume);

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}

export function addTVL(volume: BigInt, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.totalLiquidityUSD = global.totalLiquidityUSD.plus(volume);

    hourly.totalLiquidityUSD = global.totalLiquidityUSD;
    daily.totalLiquidityUSD = global.totalLiquidityUSD;
    monthly.totalLiquidityUSD = global.totalLiquidityUSD;

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}

export function removeTVL(volume: BigInt, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.totalLiquidityUSD = global.totalLiquidityUSD.minus(volume);

    hourly.totalLiquidityUSD = global.totalLiquidityUSD;
    daily.totalLiquidityUSD = global.totalLiquidityUSD;
    monthly.totalLiquidityUSD = global.totalLiquidityUSD;

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}

export function addFees(volume: BigDecimal, blockTimestamp: BigInt): void {

    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);

    global.Fees = global.Fees.plus(volume);

    hourly.Fees = hourly.Fees.plus(volume);
    daily.Fees = daily.Fees.plus(volume);
    monthly.Fees = monthly.Fees.plus(volume);

    global.save();

    hourly.save();
    daily.save();
    monthly.save();
}