import { Swap, Token } from "../generated/schema";
import { Swap as SwapEvent, Sync } from "../generated/UniswapDeft/UniswapPair";
import { BI_18, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let deftInEth = Token.load("deftInEth");
  let ethInDeft = Token.load("ethInDeft");

  if (deftInEth === null) {
    deftInEth = new Token("deftInEth");
  }
  if (ethInDeft === null) {
    ethInDeft = new Token("ethInDeft");
  }

  let wethReserve = convertTokenToDecimal(event.params.reserve1, BI_18);
  let deftReserve = convertTokenToDecimal(event.params.reserve0, BI_18);

  // eth in deft
  if (wethReserve > ZERO_BD) {
    ethInDeft.price = deftReserve.div(wethReserve);
  } else {
    ethInDeft.price = ZERO_BD;
  }

  // deft in eth
  if (deftReserve > ZERO_BD) {
    deftInEth.price = wethReserve.div(deftReserve);
  } else {
    deftInEth.price = ZERO_BD;
  }

  let ethInUsd = Token.load("ethInUsd");

  let deftInUsd = Token.load("deftInUsd");

  if (deftInUsd === null) {
    deftInUsd = new Token("deftInUsd");
  }

  deftInUsd.price = deftInEth.price.times(ethInUsd.price);

  deftInEth.save();
  ethInDeft.save();
  deftInUsd.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_18);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_18);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  // ETH/USD prices
  let usdt = Token.load("ethInUsd");

  let feedType = "";

  if (amount1In > ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let deftInEth = ZERO_BD;
  let amountDeft = ZERO_BD;
  let amountDeftInEth = ZERO_BD;
  if (amount0In > ZERO_BD && amount1Out > ZERO_BD) {
    deftInEth = amount1Out.div(amount0In);

    amountDeft = amount0In;
    amountDeftInEth = amount1Out;
  } else if (amount0Out > ZERO_BD && amount1In > ZERO_BD) {
    deftInEth = amount1In.div(amount0Out);

    amountDeft = amount0Out;
    amountDeftInEth = amount1In;
  }

  let deftInUsd = deftInEth.times(usdt.price);
  let amountDeftInUsd = amountDeftInEth.times(usdt.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInEth = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );

  let transactionFeeInUsd = transactionFeeInEth.times(usdt.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.deftInEth = deftInEth;
  swap.deftInUsd = deftInUsd;

  swap.amountDeft = amountDeft;
  swap.amountDeftInEth = amountDeftInEth;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInEth = transactionFeeInEth;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}
