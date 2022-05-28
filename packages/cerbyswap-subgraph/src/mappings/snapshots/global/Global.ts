import { BigInt, BigDecimal } from '@graphprotocol/graph-ts';
import { Global } from '../../../types/schema';
import { ZERO_BI, ZERO_BD, getCerbyPrice, convertTokenToDecimal, BI_18 } from '../../helpers';
import { hourlyGlobalSnapshot } from './hourly';
import { dailyGlobalSnapshot } from './daily';
import { monthlyGlobalSnapshot } from './monthly';


export function createOrLoadGlobal(): Global {
    let global = Global.load('1');
    if(global == null) {
        global = new Global('1');
        global.totalPools = ZERO_BI;
        global.totalTransactions = ZERO_BI;
        global.totalVolumeUSD = ZERO_BD;
        global.totalLiquidityCerby = ZERO_BI;
        global.totalLiquidityUSD = ZERO_BD;
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

export function addVolumeUsd(volume: BigInt, volumeUSD: BigDecimal, blockTimestamp: BigInt): void {
    const global = createOrLoadGlobal(),
          hourly = hourlyGlobalSnapshot(global, blockTimestamp),
          daily = dailyGlobalSnapshot(global, blockTimestamp),
          monthly = monthlyGlobalSnapshot(global, blockTimestamp);


    global.totalVolumeCerby = global.totalVolumeCerby.plus(volume);

    hourly.totalVolumeCerby = hourly.totalVolumeCerby.plus(volume);
    daily.totalVolumeCerby = daily.totalVolumeCerby.plus(volume);
    monthly.totalVolumeCerby = monthly.totalVolumeCerby.plus(volume);

    global.totalVolumeUSD = global.totalVolumeUSD.plus(volumeUSD);

    hourly.totalVolumeUSD = hourly.totalVolumeUSD.plus(volumeUSD);
    daily.totalVolumeUSD = daily.totalVolumeUSD.plus(volumeUSD);
    monthly.totalVolumeUSD = monthly.totalVolumeUSD.plus(volumeUSD);

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

    global.totalLiquidityCerby = global.totalLiquidityCerby.plus(volume);
    const price = getCerbyPrice();
    if(price) {
        global.totalLiquidityUSD = convertTokenToDecimal(global.totalLiquidityCerby, BI_18).div(price);
    } else {
        global.totalLiquidityUSD = ZERO_BD;
    }


    hourly.totalLiquidityCerby = global.totalLiquidityCerby;
    daily.totalLiquidityCerby = global.totalLiquidityCerby;
    monthly.totalLiquidityCerby = global.totalLiquidityCerby;

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

    global.totalLiquidityCerby = global.totalLiquidityCerby.minus(volume);

    const price = getCerbyPrice();
    if(price) {
        global.totalLiquidityUSD = convertTokenToDecimal(global.totalLiquidityCerby, BI_18).div(price);
    } else {
        global.totalLiquidityUSD = ZERO_BD;
    }

    hourly.totalLiquidityCerby = global.totalLiquidityCerby;
    daily.totalLiquidityCerby = global.totalLiquidityCerby;
    monthly.totalLiquidityCerby = global.totalLiquidityCerby;

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