import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Pool, poolDaily, poolHourly, poolMonthly } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";
import { addVolumeUsd } from "../global/Global";
import { dailySnapshot } from './daily';
import { hourlySnapshot } from "./hourly";
import { monthlySnapshot } from "./monthly";

// declare interface changes { // interfaces not supported
//     syncLiqudity: {
//         CerUsd: BigInt
//         Token: BigInt
//     }
//     Trade: {
//         CerUsd: BigInt
//         Token: BigInt
//     }
//     price: BigDecimal
//     token: Address
//     blockTimestamp: ethereum.Event['block']['timestamp']
// }

export function createPoolSnapshot(
        Token: Address,
        price: BigDecimal,
        priceUSD: BigDecimal | null,
        blockTimestamp: BigInt,
        liqudityCerUsd: BigInt,
        liqudityToken: BigInt,
        tradeCerby: BigInt,
        tradeToken: BigInt,
        amountFeesCollected: BigInt,
        tradeUSD: BigDecimal): void {

    const pool = Pool.load(Token.toHexString());
    if(!pool) {
        return;
    }
    const hourly = hourlySnapshot(pool, Token, blockTimestamp),
          daily = dailySnapshot(pool, Token, blockTimestamp),
          monthly = monthlySnapshot(pool, Token, blockTimestamp);


    daily.balanceCerby = pool.balanceCerby;
    daily.balanceToken = pool.balanceToken;

    hourly.balanceCerby = pool.balanceCerby;
    hourly.balanceToken = pool.balanceToken;

    monthly.balanceCerby = pool.balanceCerby;
    monthly.balanceToken = pool.balanceToken;


    if(tradeCerby.notEqual(ZERO_BI)) {
        addVolumeUsd(tradeCerby, tradeUSD, blockTimestamp);
        daily.volumeCerby = daily.volumeCerby.plus(tradeCerby);
        daily.volumeUSD = daily.volumeUSD.plus(tradeUSD);
        daily.volumeToken = daily.volumeToken.plus(tradeToken);
        daily.amountFeesCollected = daily.amountFeesCollected.plus(amountFeesCollected);
        daily.APR = (daily.amountFeesCollected.times(BigInt.fromI32(365))).divDecimal(daily.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())


        hourly.volumeCerby = hourly.volumeCerby.plus(tradeCerby);
        hourly.volumeUSD = hourly.volumeUSD.plus(tradeUSD);
        hourly.volumeToken = hourly.volumeToken.plus(tradeToken);
        hourly.amountFeesCollected = hourly.amountFeesCollected.plus(amountFeesCollected);
        hourly.APR = (hourly.amountFeesCollected.times(BigInt.fromI32(8760))).divDecimal(hourly.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())


        monthly.volumeCerby = monthly.volumeCerby.plus(tradeCerby);
        monthly.volumeUSD = monthly.volumeUSD.plus(tradeUSD);
        monthly.volumeToken = monthly.volumeToken.plus(tradeToken);
        monthly.amountFeesCollected = monthly.amountFeesCollected.plus(amountFeesCollected);
        monthly.APR = (monthly.amountFeesCollected.times(BigInt.fromI32(8760))).divDecimal(monthly.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())
    }

    if(price) {
        daily.price = price;
        // daily.price
        if(daily.high.lt(price)) {
            daily.high = price;
        }
        if(daily.low.gt(price)) {
            daily.low = price;
        }
        if(daily.previous != daily.id) {
            let previousDaily = poolDaily.load(daily.previous);
            // priceChangePercent = (price(now) - price(period ago)) / price(period ago) = +-11.23456
            if(previousDaily) {
                daily.priceChangePercent = (price.minus(previousDaily.price)).div(previousDaily.price).times(BigDecimal.fromString("100"));
            }
        } else {
            daily.priceChangePercent = ZERO_BD;
        }

        hourly.price = price;
        if(hourly.high.lt(price)) {
            hourly.high = price;
        }
        if(hourly.low.gt(price)) {
            hourly.low = price;
        }
        if(hourly.previous != hourly.id) {
            let previousHourly = poolHourly.load(hourly.previous)!;
            if(previousHourly) {
                hourly.priceChangePercent = (price.minus(previousHourly.price)).div(previousHourly.price).times(BigDecimal.fromString("100"));
            }
        } else {
            hourly.priceChangePercent = ZERO_BD;
        }

        monthly.price = price;
        if(monthly.high.lt(price)) {
            monthly.high = price;
        }
        if(monthly.low.gt(price)) {
            monthly.low = price;
        }
        if(monthly.previous != monthly.id) {
            let previousMonthly = poolMonthly.load(monthly.previous)!;
            if(previousMonthly) {
                monthly.priceChangePercent = (price.minus(previousMonthly.price)).div(previousMonthly.price).times(BigDecimal.fromString("100"));
            }
        } else {
            monthly.priceChangePercent = ZERO_BD;
        }
    }


    if(priceUSD) {
        daily.priceUSD = priceUSD;
        // daily.price
        if(daily.highUSD.lt(priceUSD)) {
            daily.highUSD = priceUSD;
        }
        if(daily.lowUSD.gt(priceUSD)) {
            daily.lowUSD = priceUSD;
        }
        if(daily.previous != daily.id) {
            let previousDaily = poolDaily.load(daily.previous);
            // priceChangePercent = (price(now) - price(period ago)) / price(period ago) = +-11.23456
            if(previousDaily) {
                daily.priceUSDChangePercent = (priceUSD.minus(previousDaily.priceUSD)).div(previousDaily.priceUSD).times(BigDecimal.fromString("100"));
            }
        } else {
            daily.priceUSDChangePercent = ZERO_BD;
        }

        hourly.priceUSD = priceUSD;
        if(hourly.highUSD.lt(priceUSD)) {
            hourly.highUSD = priceUSD;
        }
        if(hourly.lowUSD.gt(priceUSD)) {
            hourly.lowUSD = priceUSD;
        }
        if(hourly.previous != hourly.id) {
            let previousHourly = poolHourly.load(hourly.previous)!;
            if(previousHourly) {
                hourly.priceUSDChangePercent = (priceUSD.minus(previousHourly.priceUSD)).div(previousHourly.priceUSD).times(BigDecimal.fromString("100"));
            }
        } else {
            hourly.priceUSDChangePercent = ZERO_BD;
        }

        monthly.priceUSD = priceUSD;
        if(monthly.highUSD.lt(priceUSD)) {
            monthly.highUSD = priceUSD;
        }
        if(monthly.lowUSD.gt(priceUSD)) {
            monthly.lowUSD = priceUSD;
        }
        if(monthly.previous != monthly.id) {
            let previousMonthly = poolMonthly.load(monthly.previous)!;
            if(previousMonthly) {
                monthly.priceUSDChangePercent = (priceUSD.minus(previousMonthly.priceUSD)).div(previousMonthly.priceUSD).times(BigDecimal.fromString("100"));
            }
        } else {
            monthly.priceUSDChangePercent = ZERO_BD;
        }
    }

    hourly.save();
    daily.save();
    monthly.save();
}