import { Swap, Token } from "../generated/schema";
import {
  Swap as SwapEvent,
  Sync,
} from "../generated/TraderJoeCerby/TraderJoePair";
import { BI_18, BI_6, convertTokenToDecimal, ZERO_BD } from "./helpers";

export function handleSync(event: Sync): void {
  let cerbyInUsd = Token.load("cerbyInUsd");

  if (cerbyInUsd === null) {
    cerbyInUsd = new Token("cerbyInUsd");
  }

  let usdcReserve = convertTokenToDecimal(event.params.reserve0, BI_6);
  let cerbyReserve = convertTokenToDecimal(event.params.reserve1, BI_18);

  if (cerbyReserve > ZERO_BD) {
    cerbyInUsd.price = usdcReserve.div(cerbyReserve);
  } else {
    cerbyInUsd.price = ZERO_BD;
  }

  cerbyInUsd.save();
}

export function handleSwap(event: SwapEvent): void {
  let amount0In = convertTokenToDecimal(event.params.amount0In, BI_6);
  let amount1In = convertTokenToDecimal(event.params.amount1In, BI_18);
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, BI_6);
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, BI_18);

  let ftmInUsd = Token.load("ftmInUsd");
  let usdInFtm = Token.load("usdInFtm");

  let feedType = "";

  if (amount0In > ZERO_BD) {
    feedType = "buy";
  } else {
    feedType = "sell";
  }

  let cerbyInUsd = ZERO_BD;
  let amountCerby = ZERO_BD;
  let amountCerbyInUsd = ZERO_BD;

  if (amount1In > ZERO_BD && amount0Out > ZERO_BD) {
    cerbyInUsd = amount0Out.div(amount1In);

    amountCerby = amount1In;
    amountCerbyInUsd = amount0Out;
  } else if (amount1Out > ZERO_BD && amount0In > ZERO_BD) {
    cerbyInUsd = amount0In.div(amount1Out);

    amountCerby = amount1Out;
    amountCerbyInUsd = amount0In;
  }

  let cerbyInFtm = cerbyInUsd.times(usdInFtm.price);
  let amountCerbyInFtm = amountCerbyInUsd.times(usdInFtm.price);

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let transactionFeeInFtm = convertTokenToDecimal(
    gasPrice.times(gasUsed),
    BI_18,
  );

  let transactionFeeInUsd = transactionFeeInFtm.times(ftmInUsd.price);

  swap.feedType = feedType;
  swap.txHash = event.transaction.hash;
  swap.timestamp = event.block.timestamp;
  swap.sender = event.params.sender;
  swap.from = event.transaction.from;
  swap.to = event.params.to;

  swap.cerbyInFtm = cerbyInFtm;
  swap.cerbyInUsd = cerbyInUsd;

  swap.amountCerby = amountCerby;
  swap.amountCerbyInFtm = amountCerbyInFtm;
  swap.amountCerbyInUsd = amountCerbyInUsd;

  swap.transactionFeeInFtm = transactionFeeInFtm;
  swap.transactionFeeInUsd = transactionFeeInUsd;

  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;

  swap.save();
}
