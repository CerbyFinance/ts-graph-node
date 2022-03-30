import { Token } from "../generated/schema";
import { Sync } from "../generated/UniswapUsdt/UniswapPair";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInEth = Token.load("usdInEth");
  let ethInUsd = Token.load("ethInUsd");
  if (usdInEth === null) {
    usdInEth = new Token("usdInEth");
  }
  if (ethInUsd === null) {
    ethInUsd = new Token("ethInUsd");
  }

  let wethReserve = ZERO_BD;
  let usdtReserve = ZERO_BD;

  wethReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  usdtReserve = convertTokenToDecimal(event.params.reserve1, BI_6);

  // usd in eth
  if (usdtReserve > ZERO_BD) {
    usdInEth.price = wethReserve.div(usdtReserve);
  } else {
    usdInEth.price = ZERO_BD;
  }

  // weth in usd
  if (wethReserve > ZERO_BD) {
    ethInUsd.price = usdtReserve.div(wethReserve);
  } else {
    ethInUsd.price = ZERO_BD;
  }

  ethInUsd.save();
  usdInEth.save();
}
