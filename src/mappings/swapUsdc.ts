import { Sync } from "../types/SpookySwapUdc/SpookySwapPair";
import { Token } from "../types/schema";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInFtm = Token.load("usdInFtm");
  let ftmInUsd = Token.load("ftmInUsd");
  if (usdInFtm === null) {
    usdInFtm = new Token("usdInFtm");
  }
  if (ftmInUsd === null) {
    ftmInUsd = new Token("ftmInUsd");
  }

  let wftmReserve = ZERO_BD;
  let usdcReserve = ZERO_BD;

  usdcReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  wftmReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  usdInFtm.price = usdcReserve > ZERO_BD ? wftmReserve.div(usdcReserve) : ZERO_BD;

  ftmInUsd.price = wftmReserve > ZERO_BD ? usdcReserve.div(wftmReserve) : ZERO_BD;

  ftmInUsd.save();
  usdInFtm.save();
}