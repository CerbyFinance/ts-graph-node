import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Pool, poolHourly } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function hourlySnapshot(pool: Pool, token: Address, blockTimestamp: BigInt): poolHourly {
    let timestamp = blockTimestamp.toI32()
    let hourID = timestamp / 3600
    let hourStartTimestamp = hourID * 3600
    let tokenHourID = token
      .toHexString()
      .concat('-')
      .concat(BigInt.fromI32(hourID).toString())
  
    let tokenHourData = poolHourly.load(tokenHourID);
    if (tokenHourData == null) {
      tokenHourData = new poolHourly(tokenHourID)
      tokenHourData.startUnix = hourStartTimestamp;
      tokenHourData.token = token.toHexString();
      tokenHourData.volumeToken = ZERO_BI;
      tokenHourData.volumeCerby = ZERO_BI;
      tokenHourData.volumeUSD = ZERO_BD;
      tokenHourData.amountFeesCollected = ZERO_BI;
      tokenHourData.APR = ZERO_BD;


      tokenHourData.open = ZERO_BD;
      tokenHourData.close = ZERO_BD;
      tokenHourData.high = ZERO_BD;
      tokenHourData.low = ZERO_BD;

      tokenHourData.openUSD = ZERO_BD;
      tokenHourData.closeUSD = ZERO_BD;
      tokenHourData.highUSD = ZERO_BD;
      tokenHourData.lowUSD = ZERO_BD;


      if(pool) {
        tokenHourData.balanceToken = pool.balanceToken;
        tokenHourData.balanceCerby = pool.balanceCerby;
        tokenHourData.price = pool.price;
        tokenHourData.priceUSD = pool.priceUSD;

        if(!pool.latestHourlies) {
            tokenHourData.previous = tokenHourID;
        } else {
            tokenHourData.previous = pool.latestHourlies;
            const previousTokenHourData = poolHourly.load(pool.latestHourlies)!;
            previousTokenHourData.close = previousTokenHourData.price;
            previousTokenHourData.closeUSD = previousTokenHourData.priceUSD;
            previousTokenHourData.save();

            tokenHourData.open = previousTokenHourData.price;
            tokenHourData.high = previousTokenHourData.price;
            tokenHourData.low = previousTokenHourData.price;

            tokenHourData.openUSD = previousTokenHourData.priceUSD;
            tokenHourData.highUSD = previousTokenHourData.priceUSD;
            tokenHourData.lowUSD = previousTokenHourData.priceUSD;
        }
        pool.latestHourlies = tokenHourID;
        pool.save()
      }
    }
  
    return tokenHourData as poolHourly;
}