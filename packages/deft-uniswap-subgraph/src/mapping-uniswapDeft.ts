import { BigDecimal } from "@graphprotocol/graph-ts";
import { Swap, Token } from "../generated/schema";
import { Swap as SwapEvent } from "../generated/UniswapDeft/UniswapV3PoolEvents";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

function abs(a: BigDecimal): BigDecimal {
  if (a.ge(ZERO_BD)) {
    return a;
  }

  return a.neg();
}

export function handleSwap(event: SwapEvent): void {
  let sender = event.params.sender;
  let recipient = event.params.recipient;

  // usdc
  let amount0 = convertTokenToDecimal(event.params.amount0, BI_6);
  // deft
  let amount1 = convertTokenToDecimal(event.params.amount1, BI_18);

  let feedType = "";
  if (amount0 > ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let amountDeft = abs(amount1);
  let amountDeftInUsd = abs(amount0);

  let deftInUsd = Token.load("deftInUsd");
  if (deftInUsd === null) {
    deftInUsd = new Token("deftInUsd");
  }

  if (amountDeft > ZERO_BD) {
    deftInUsd.price = amountDeftInUsd.div(amountDeft);
  } else {
    deftInUsd.price = ZERO_BD;
  }
  deftInUsd.save();

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

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.recipient;

  swap.amountDeft = amountDeft;
  swap.amountDeftInUsd = amountDeftInUsd;

  swap.transactionFeeInEth = transactionFeeInEth;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}
