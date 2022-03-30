import { Sync } from "../generated/PancakeswapDeft/PancakeswapPair";
import { Token } from "../generated/schema";
import { BI_18, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let usdInBnb = Token.load("usdInBnb");
  let bnbInUsd = Token.load("bnbInUsd");
  if (usdInBnb === null) {
    usdInBnb = new Token("usdInBnb");
  }
  if (bnbInUsd === null) {
    bnbInUsd = new Token("bnbInUsd");
  }

  let wbnbReserve = ZERO_BD;
  let usdtReserve = ZERO_BD;

  wbnbReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  usdtReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  // usd in bnb
  if (usdtReserve > ZERO_BD) {
    usdInBnb.price = wbnbReserve.div(usdtReserve);
  } else {
    usdInBnb.price = ZERO_BD;
  }

  // wbnb in usd
  if (wbnbReserve > ZERO_BD) {
    bnbInUsd.price = usdtReserve.div(wbnbReserve);
  } else {
    bnbInUsd.price = ZERO_BD;
  }

  bnbInUsd.save();
  usdInBnb.save();
}
