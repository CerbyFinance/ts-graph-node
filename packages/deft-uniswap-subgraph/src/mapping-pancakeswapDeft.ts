import {
  Swap as SwapEvent,
  Sync,
} from "../generated/PancakeswapDeft/PancakeswapPair";
import { Swap, Token } from "../generated/schema";
import { BI_18, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let bnbInUsd = Token.load("bnbInUsd");
  let deftInUsd = Token.load("deftInUsd");

  if (bnbInUsd === null) {
    bnbInUsd = new Token("bnbInUsd");
  }

  if (deftInUsd === null) {
    deftInUsd = new Token("deftInUsd");
  }

  let deftReserve = convertTokenToDecimal(event.params.reserve0, BI_18);
  let usdcReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  if (usdcReserve > ZERO_BD) {
    bnbInUsd.price = deftReserve.div(usdcReserve);
  } else {
    bnbInUsd.price = ZERO_BD;
  }

  if (deftReserve > ZERO_BD) {
    deftInUsd.price = usdcReserve.div(deftReserve);
  } else {
    deftInUsd.price = ZERO_BD;
  }

  bnbInUsd.save();
  deftInUsd.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_18);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_18);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  let bnbInUsd = Token.load("bnbInUsd");
  let usdInBnb = Token.load("usdInBnb");

  let feedType = "";

  if (amount0In > ZERO_BD) {
    feedType = "sell";
  } else {
    feedType = "buy";
  }

  let deftInUsd = ZERO_BD;
  let amountDeft = ZERO_BD;
  let amountDeftInUsd = ZERO_BD;

  if (amount1In > ZERO_BD && amount0Out > ZERO_BD) {
    deftInUsd = amount1In.div(amount0Out);

    amountDeft = amount0Out;
    amountDeftInUsd = amount1In;
  } else if (amount1Out > ZERO_BD && amount0In > ZERO_BD) {
    deftInUsd = amount1Out.div(amount0In);

    amountDeft = amount0In;
    amountDeftInUsd = amount1Out;
  }

  // let deftInUsd = deftInBnb.times(bnbInUsd.price);
  let deftInBnb = deftInUsd.times(usdInBnb.price);
  // let amountDeftInUsd = amountDeftInBnb.times(bnbInUsd.price);

  let amountDeftInBnb = amountDeftInUsd.times(usdInBnb.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInBnb = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );

  let transactionFeeInUsd = transactionFeeInBnb.div(bnbInUsd.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.deftInBnb = deftInBnb;
  swap.deftInUsd = deftInUsd;

  swap.amountDeft = amountDeft;
  swap.amountDeftInBnb = amountDeftInBnb;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInBnb = transactionFeeInBnb;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}
