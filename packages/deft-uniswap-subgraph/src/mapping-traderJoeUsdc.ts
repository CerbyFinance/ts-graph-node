import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInAvax = Token.load("usdInAvax");
  let avaxInUsd = Token.load("avaxInUsd");
  if (usdInAvax === null) {
    usdInAvax = new Token("usdInAvax");
  }
  if (avaxInUsd === null) {
    avaxInUsd = new Token("avaxInUsd");
  }

  let wavaxReserve = ZERO_BD;
  let usdcReserve = ZERO_BD;

  usdcReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  wavaxReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  // usd in avax
  if (usdcReserve > ZERO_BD) {
    usdInAvax.price = wavaxReserve.div(usdcReserve);
  } else {
    usdInAvax.price = ZERO_BD;
  }

  // wavax in usd
  if (wavaxReserve > ZERO_BD) {
    avaxInUsd.price = usdcReserve.div(wavaxReserve);
  } else {
    avaxInUsd.price = ZERO_BD;
  }

  avaxInUsd.save();
  usdInAvax.save();
}
