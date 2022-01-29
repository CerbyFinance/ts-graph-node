import { BigInt } from "@graphprotocol/graph-ts";
import { Global, GlobalHourly } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function hourlyGlobalSnapshot(GlobalObj: Global, blockTimestamp: BigInt): GlobalHourly {
    let timestamp = blockTimestamp.toI32()
    let hourID = timestamp / 3600
    let hourStartTimestamp = hourID * 3600
    let globalHourID = BigInt.fromI32(hourID).toString();
  
    let globalHourData = GlobalHourly.load(globalHourID)
    // global = .load(global.toHexString());
    if (globalHourData === null) {
      globalHourData = new GlobalHourly(globalHourID)
      globalHourData.startUnix = hourStartTimestamp;
      globalHourData.totalTransactions = ZERO_BI;
      globalHourData.totalVolumeUSD = ZERO_BI;
      globalHourData.Fees = ZERO_BD;

      if(GlobalObj) {
        globalHourData.totalPools = GlobalObj.totalPools;
        globalHourData.totalLiquidityUSD = GlobalObj.totalLiquidityUSD;
        if(!GlobalObj.latestHourlies) {
            globalHourData.previous = GlobalObj.latestHourlies;
        } else {
            globalHourData.previous = globalHourID;
        }
        GlobalObj.latestHourlies = globalHourID;
        GlobalObj.save()
      }
    }
  
    return globalHourData;
}