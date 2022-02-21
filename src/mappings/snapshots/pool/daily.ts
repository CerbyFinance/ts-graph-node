import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Pool, poolDaily } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function dailySnapshot(pool: Pool, token: Address, blockTimestamp: BigInt): poolDaily {
    let timestamp = blockTimestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let tokenDayID = token
      .toHexString()
      .concat('-')
      .concat(BigInt.fromI32(dayID).toString())
  
    let tokenDayData = poolDaily.load(tokenDayID);
    if (tokenDayData == null) {
      tokenDayData = new poolDaily(tokenDayID)
      tokenDayData.startUnix = dayStartTimestamp;
      tokenDayData.token = token.toHexString();
      tokenDayData.volumeToken = ZERO_BI;
      tokenDayData.volumeUSD = ZERO_BI;
      tokenDayData.amountFeesCollected = ZERO_BI;
      tokenDayData.APR = ZERO_BD;
      tokenDayData.open = ZERO_BD;
      tokenDayData.close = ZERO_BD;
      tokenDayData.high = ZERO_BD;
      tokenDayData.low = ZERO_BD;

      if(pool) {
        tokenDayData.balanceToken = pool.balanceToken;
        tokenDayData.balanceCerUsd = pool.balanceCerUsd;
        tokenDayData.price = pool.price;
        if(!pool.latestDailies) {
            tokenDayData.previous = tokenDayID;
        } else {
            tokenDayData.previous = pool.latestDailies;
            const previousTokenDayData = poolDaily.load(pool.latestDailies)!;
            previousTokenDayData.close = previousTokenDayData.price;
            previousTokenDayData.save();
            tokenDayData.open = previousTokenDayData.price;
            tokenDayData.high = previousTokenDayData.price;
            tokenDayData.low = previousTokenDayData.price;
        }
        pool.latestDailies = tokenDayID;
        pool.save()
      }
    }
  
    return tokenDayData as poolDaily;
}