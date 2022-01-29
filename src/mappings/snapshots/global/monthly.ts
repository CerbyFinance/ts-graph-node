import { BigInt } from "@graphprotocol/graph-ts";
import { Global, GlobalMonthly } from "../../../types/schema";
import { ZERO_BD, ZERO_BI } from "../../helpers";

export function monthlyGlobalSnapshot(GlobalObj: Global, blockTimestamp: BigInt): GlobalMonthly {
    let timestamp = blockTimestamp.toI32()
    let monthID = timestamp / 2592000
    let monthStartTimestamp = monthID * 2592000
    let globalMonthID = BigInt.fromI32(monthID).toString();
  
    let globalMonthData = GlobalMonthly.load(globalMonthID)
    // global = .load(global.toHexString());
    if (globalMonthData === null) {
      globalMonthData = new GlobalMonthly(globalMonthID)
      globalMonthData.startUnix = monthStartTimestamp;
      globalMonthData.totalTransactions = ZERO_BI;
      globalMonthData.totalVolumeUSD = ZERO_BI;
      globalMonthData.Fees = ZERO_BD;

      if(GlobalObj) {
        globalMonthData.totalPools = GlobalObj.totalPools;
        globalMonthData.totalLiquidityUSD = GlobalObj.totalLiquidityUSD;
        if(!GlobalObj.latestMonthlies) {
            globalMonthData.previous = GlobalObj.latestMonthlies;
        } else {
            globalMonthData.previous = globalMonthID;
        }
        GlobalObj.latestMonthlies = globalMonthID;
        GlobalObj.save()
      }
    }
  
    return globalMonthData;
}