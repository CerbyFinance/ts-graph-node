import {
  Swap as SwapEvent,
  Sync,
} from "../generated/PancakeswapDeft/PancakeswapPair";
import { Swap, Token } from "../generated/schema";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let deftInUsd = Token.load("deftInUsd");

  if (deftInUsd === null) {
    deftInUsd = new Token("deftInUsd");
  }

  let usdcReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  let deftReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  if (deftReserve > ZERO_BD) {
    deftInUsd.price = usdcReserve.div(deftReserve);
  } else {
    deftInUsd.price = ZERO_BD;
  }

  deftInUsd.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_6);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_6);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  let maticInUsd = Token.load("maticInUsd");
  let usdInMatic = Token.load("usdInMatic");

  let feedType = "";

  if (amount0In > ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let deftInUsd = ZERO_BD;
  let amountDeft = ZERO_BD;
  let amountDeftInUsd = ZERO_BD;
  // let amountDeftInMatic = ZERO_BD;

  if (amount1In > ZERO_BD && amount0Out > ZERO_BD) {
    deftInUsd = amount0Out.div(amount1In);

    amountDeft = amount1In;
    amountDeftInUsd = amount0Out;
  } else if (amount1Out > ZERO_BD && amount0In > ZERO_BD) {
    deftInUsd = amount0In.div(amount1Out);

    amountDeft = amount1Out;
    amountDeftInUsd = amount0In;
  }

  // let deftInUsd = deftInMatic.times(maticInUsd.price);
  let deftInMatic = deftInUsd.times(usdInMatic.price);
  // let amountDeftInUsd = amountDeftInMatic.times(maticInUsd.price);

  let amountDeftInMatic = amountDeftInUsd.times(usdInMatic.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInMatic = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );

  let transactionFeeInUsd = transactionFeeInMatic.times(maticInUsd.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.deftInMatic = deftInMatic;
  swap.deftInUsd = deftInUsd;

  swap.amountDeft = amountDeft;
  swap.amountDeftInMatic = amountDeftInMatic;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInMatic = transactionFeeInMatic;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}
