import { BigInt } from "@graphprotocol/graph-ts";
import { Global, GlobalDaily } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function dailyGlobalSnapshot(GlobalObj: Global, blockTimestamp: BigInt): GlobalDaily {
    let timestamp = blockTimestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let globalDayID = BigInt.fromI32(dayID).toString();
  
    let globalDayData = GlobalDaily.load(globalDayID)
    // global = .load(global.toHexString());
    if (globalDayData === null) {
      globalDayData = new GlobalDaily(globalDayID)
      globalDayData.startUnix = dayStartTimestamp;
      globalDayData.totalTransactions = ZERO_BI;
      globalDayData.totalVolumeUSD = ZERO_BI;
      globalDayData.Fees = ZERO_BD;

      if(GlobalObj) {
        globalDayData.totalPools = GlobalObj.totalPools;
        globalDayData.totalLiquidityUSD = GlobalObj.totalLiquidityUSD;
        if(!GlobalObj.latestDailies) {
            globalDayData.previous = GlobalObj.latestDailies;
        } else {
            globalDayData.previous = globalDayID;
        }
        GlobalObj.latestDailies = globalDayID;
        GlobalObj.save()
      }
    }
  
    return globalDayData;
}