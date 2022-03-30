import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
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

  // usd in ftm
  if (usdcReserve > ZERO_BD) {
    usdInFtm.price = wftmReserve.div(usdcReserve);
  } else {
    usdInFtm.price = ZERO_BD;
  }

  // wftm in usd
  if (wftmReserve > ZERO_BD) {
    ftmInUsd.price = usdcReserve.div(wftmReserve);
  } else {
    ftmInUsd.price = ZERO_BD;
  }

  ftmInUsd.save();
  usdInFtm.save();
}
