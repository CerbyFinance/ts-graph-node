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
        blockTimestamp: BigInt,
        liqudityCerUsd: BigInt,
        liqudityToken: BigInt,
        tradeCerUsd: BigInt,
        tradeToken: BigInt,
        amountFeesCollected: BigInt): void {

    const pool = Pool.load(Token.toHexString());
    if(!pool) {
        return;
    }
    const hourly = hourlySnapshot(pool, Token, blockTimestamp),
          daily = dailySnapshot(pool, Token, blockTimestamp),
          monthly = monthlySnapshot(pool, Token, blockTimestamp);
    

    if(liqudityCerUsd.notEqual(ZERO_BI)) {
        daily.balanceCerUsd = liqudityCerUsd;
        daily.balanceToken = liqudityToken;


        hourly.balanceCerUsd = liqudityCerUsd;
        hourly.balanceToken = liqudityToken;


        monthly.balanceCerUsd = liqudityCerUsd;
        monthly.balanceToken = liqudityToken;


    } else if(tradeCerUsd.notEqual(ZERO_BI)) {
        addVolumeUsd(tradeCerUsd, blockTimestamp);
        daily.volumeUSD = daily.volumeUSD.plus(tradeCerUsd);
        daily.volumeToken = daily.volumeToken.plus(tradeToken);
        daily.amountFeesCollected = daily.amountFeesCollected.plus(amountFeesCollected);
        daily.APR = (daily.amountFeesCollected.times(BigInt.fromI32(365))).divDecimal(daily.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())


        hourly.volumeUSD = hourly.volumeUSD.plus(tradeCerUsd);
        hourly.volumeToken = hourly.volumeToken.plus(tradeToken);
        hourly.amountFeesCollected = hourly.amountFeesCollected.plus(amountFeesCollected);
        hourly.APR = (hourly.amountFeesCollected.times(BigInt.fromI32(8760))).divDecimal(hourly.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())


        monthly.volumeUSD = monthly.volumeUSD.plus(tradeCerUsd);
        monthly.volumeToken = monthly.volumeToken.plus(tradeToken);
        monthly.amountFeesCollected = monthly.amountFeesCollected.plus(amountFeesCollected);
        monthly.APR = (monthly.amountFeesCollected.times(BigInt.fromI32(8760))).divDecimal(monthly.balanceToken.times(BigInt.fromI32(1)).toBigDecimal())
    }

    if(price) {
        daily.price = price;
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
                hourly.priceChangePercent = (price.minus(previousHourly.price)).div(previousHourly.price);
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
                monthly.priceChangePercent = (price.minus(previousMonthly.price)).div(previousMonthly.price);
            }
        } else {
            monthly.priceChangePercent = ZERO_BD;
        }
    }

    hourly.save();
    daily.save();
    monthly.save();
}