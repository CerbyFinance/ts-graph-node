import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Pool, poolMonthly } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function monthlySnapshot(pool: Pool, token: Address, blockTimestamp: BigInt): poolMonthly {
    let timestamp = blockTimestamp.toI32()
    let monthID = timestamp / 2592000
    let monthStartTimestamp = monthID * 2592000
    let tokenMonthID = token
      .toHexString()
      .concat('-')
      .concat(BigInt.fromI32(monthID).toString())
  
    let tokenMonthData = poolMonthly.load(tokenMonthID);
    if (tokenMonthData == null) {
      tokenMonthData = new poolMonthly(tokenMonthID)
      tokenMonthData.startUnix = monthStartTimestamp;
      tokenMonthData.token = token.toHexString();
      tokenMonthData.volumeToken = ZERO_BI;
      tokenMonthData.volumeUSD = ZERO_BI;
      tokenMonthData.amountFeesCollected = ZERO_BI;
      tokenMonthData.APR = ZERO_BD;
      tokenMonthData.open = ZERO_BD;
      tokenMonthData.close = ZERO_BD;
      tokenMonthData.high = ZERO_BD;
      tokenMonthData.low = ZERO_BD;

      if(pool) {
        tokenMonthData.balanceToken = pool.balanceToken;
        tokenMonthData.balanceCerUsd = pool.balanceCerUsd;
        tokenMonthData.price = pool.price;
        if(!pool.latestMonthlies) {
            tokenMonthData.previous = tokenMonthID;
        } else {
            tokenMonthData.previous = pool.latestMonthlies;
            const previousTokenMonthData = poolMonthly.load(pool.latestMonthlies)!;
            previousTokenMonthData.close = previousTokenMonthData.price;
            previousTokenMonthData.save();
            tokenMonthData.open = previousTokenMonthData.price;
            tokenMonthData.high = previousTokenMonthData.price;
            tokenMonthData.low = previousTokenMonthData.price;
        }
        pool.latestMonthlies = tokenMonthID;
        pool.save()
      }
    }
  
    return tokenMonthData as poolMonthly;
}