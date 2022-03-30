import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInMatic = Token.load("usdInMatic");
  let maticInUsd = Token.load("maticInUsd");
  if (usdInMatic === null) {
    usdInMatic = new Token("usdInMatic");
  }
  if (maticInUsd === null) {
    maticInUsd = new Token("maticInUsd");
  }

  let wmaticReserve = ZERO_BD;
  let usdtReserve = ZERO_BD;

  wmaticReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  usdtReserve = convertTokenToDecimal(event.params.reserve1, BI_6);

  // usd in matic
  if (usdtReserve > ZERO_BD) {
    usdInMatic.price = wmaticReserve.div(usdtReserve);
  } else {
    usdInMatic.price = ZERO_BD;
  }

  // wmatic in usd
  if (wmaticReserve > ZERO_BD) {
    maticInUsd.price = usdtReserve.div(wmaticReserve);
  } else {
    maticInUsd.price = ZERO_BD;
  }

  maticInUsd.save();
  usdInMatic.save();
}
