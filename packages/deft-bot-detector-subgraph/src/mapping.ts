import { Address, Bytes, dataSource, ethereum } from "@graphprotocol/graph-ts";
import { Transfer } from "../generated/Deft/DeftToken";
import { Global, Recipient, Transaction } from "../generated/schema";
import {
  Swap as SwapEvent,
  UniswapPair,
} from "../generated/Uniswap/UniswapPair";
import { BI_10800, ONE_BI, ZERO_BI } from "./helpers";

function getOrCreateGlobal(): Global | null {
  let global = Global.load("1");

  if (global == null) {
    global = new Global("1");
    global.botsDetected = ZERO_BI;
    global.save();
  }

  return global;
}

function getOrCreateRecipient(id: string, txHash: string): Recipient | null {
  let recipient = Recipient.load(id);

  if (recipient == null) {
    recipient = new Recipient(id);
    recipient.isNewHolder = true;
    recipient.firstTx = txHash;
    recipient.lastTx = null;
    recipient.save();
  } else {
    recipient.isNewHolder = false;
    recipient.lastTx = txHash;
    recipient.save();
  }

  return recipient;
}

// type TxType = "Sell" | "Buy" | "Unknown" | "Bridge";

function getOrCreateTransaction(
  transaction: ethereum.Transaction,
  block: ethereum.Block,
  type: string,
  fnName: string,
  recipient?: string,
): Transaction | null {
  let hash = transaction.hash.toHexString();
  let to = transaction.to;

  let tx = Transaction.load(hash);

  if (tx == null) {
    tx = new Transaction(hash);
    tx.to = to.toHexString();
    tx.recipients = [];
    tx.type = type;
    tx.fnName = fnName;
    tx.amountInMax = ZERO_BI;
    tx.amountOutMin = ZERO_BI;
    tx.deadline = ZERO_BI;
    // tx.isDeadlineBot = null;
    tx.blockNumber = block.timestamp;
    tx.timestamp = block.timestamp;
  }

  if (recipient) {
    let recipients = tx.recipients;
    recipients.push(recipient);
    tx.recipients = recipients;
  }

  // update inplace
  tx.fnName = fnName;
  tx.type = type;
  tx.save();

  return tx;
}

// handle transfer

export function handleTransfer(event: Transfer): void {
  let txHash = event.transaction.hash.toHexString();

  let transaction = event.transaction;
  let block = event.block;

  let transferTo = event.params.to.toHexString();

  let recipient = getOrCreateRecipient(transferTo, txHash);
  let _transaction = getOrCreateTransaction(
    transaction,
    block,
    "Unknown",
    "unknown",
    transferTo,
  );
}

function getIsToken0Deft(deftAddr: Address): string {
  let context = dataSource.context();

  let isToken0Deft = context.getString("isToken0Deft");

  if (!isToken0Deft) {
    let contract = UniswapPair.bind(deftAddr);
    let token0 = contract.token0();
    isToken0Deft = token0.toHexString() == deftAddr.toHexString() ? "y" : "n";
    context.setString("isToken0Deft", isToken0Deft);
  }

  return isToken0Deft;
}

export function handleSwap(event: SwapEvent): void {
  let input = event.transaction.input;
  let transactionTo = event.transaction.to!;

  let deftAddr = event.address;

  let amount0In = event.params.amount0In;
  let amount1In = event.params.amount1In;

  let isToken0Deft = getIsToken0Deft(deftAddr);

  let defaultOrder = isToken0Deft == "y";

  let isBuy = false;
  if (defaultOrder) {
    isBuy = amount1In > ONE_BI;
  } else {
    isBuy = amount0In > ONE_BI;
  }

  UniswapPair.bind(Address.fromString("")).try_name();

  // swapExactETHForTokensSupportingFeeOnTransferTokens
  // swapExactETHForTokens
  // (uint256 amountOutMin, address[] path, address to, uint256 deadline)
  // uint256,placeholder,address,uint256,size,address[n])
  // uint256,uint256,address,uint256,uint256

  let fnArgs = input.toHexString().slice(10);
  let fnAddr = input.toHexString().slice(0, 10);

  // bridge call
  // if (fnAddr == "0x7ba77f6d") {
  //   return;
  // }

  let sliced = Bytes.fromHexString("0x" + fnArgs);

  let shouldDecode4 =
    fnAddr == "0xfb3bdb41" || fnAddr == "0x7ff36ab5" || fnAddr == "0xb6f9de95";

  let shouldDecode5 =
    fnAddr == "0x38ed1739" || fnAddr == "0x5c11d795" || fnAddr == "0x8803dbee";

  let decoded4 = new ethereum.Tuple();
  if (shouldDecode4) {
    decoded4 = ethereum
      .decode("(uint256,uint256,address,uint256,uint256)", sliced as Bytes)
      .toTuple();
  }

  let decoded5 = new ethereum.Tuple();
  if (shouldDecode5) {
    // prettier-ignore
    decoded5 = ethereum
      .decode("(uint256,uint256,uint256,address,uint256,uint256)", sliced as Bytes)
      .toTuple();
  }

  let amountInMax = ZERO_BI;
  let amountOutMin = ZERO_BI;
  let deadline = ZERO_BI;
  let fnName = "unknown";

  if (fnAddr == "0xfb3bdb41") {
    fnName = "swapETHForExactTokens";
    amountInMax = event.transaction.value;
    amountOutMin = ZERO_BI;
    deadline = decoded4[3].toBigInt();
  } else if (fnAddr == "0x7ff36ab5") {
    fnName = "swapExactETHForTokens";
    amountInMax = ZERO_BI;
    amountOutMin = decoded4[0].toBigInt();
    deadline = decoded4[3].toBigInt();
  } else if (fnAddr == "0xb6f9de95") {
    fnName = "swapExactETHForTokensSupportingFeeOnTransferTokens";
    amountInMax = ZERO_BI;
    amountOutMin = decoded4[0].toBigInt();
    deadline = decoded4[3].toBigInt();
  } else if (fnAddr == "0x18cbafe5") {
    fnName = "swapExactTokensForETH";
    // return;
  } else if (fnAddr == "0x791ac947") {
    fnName = "swapExactTokensForETHSupportingFeeOnTransferTokens";
    // return;
  } else if (fnAddr == "0x38ed1739") {
    fnName = "swapExactTokensForTokens";
    amountInMax = ZERO_BI;
    amountOutMin = decoded5[1].toBigInt();
    deadline = decoded5[4].toBigInt();
  } else if (fnAddr == "0x5c11d795") {
    fnName = "swapExactTokensForTokensSupportingFeeOnTransferTokens";
    amountInMax = ZERO_BI;
    amountOutMin = decoded5[1].toBigInt();
    deadline = decoded5[4].toBigInt();
  } else if (fnAddr == "0x4a25d94a") {
    fnName = "swapTokensForExactETH";
    // return;
  } else if (fnAddr == "0x8803dbee") {
    fnName = "swapTokensForExactTokens";
    amountInMax = decoded5[1].toBigInt();
    amountOutMin = ZERO_BI;
    deadline = decoded5[4].toBigInt();
  } else {
    // not found
    return;
  }

  // if (!isBuy) {
  //   return;
  // }

  let transaction = getOrCreateTransaction(
    event.transaction,
    event.block,
    // "Buy",
    isBuy ? "Buy" : "Sell",
    fnName,
    "",
  );

  transaction.isDeadlineBot = deadline > event.block.timestamp.plus(BI_10800);

  transaction.amountInMax = amountInMax;
  transaction.amountOutMin = amountOutMin;
  transaction.deadline = deadline;
  transaction.save();
  // maxLogIndex

  if (transaction.maxLogIndex == null) {
    transaction.maxLogIndex = event.logIndex;
  }

  if (transaction.amount0In == ZERO_BI) {
    transaction.amount0In = event.params.amount0In;
    transaction.amount1In = event.params.amount1In;
  }

  if (transaction.maxLogIndex == -1) {
    transaction.amount0Out = event.params.amount0Out;
    transaction.amount1Out = event.params.amount1Out;
    transaction.amount0In = event.params.amount0In;
    transaction.amount1In = event.params.amount1In;
  }

  if (event.logIndex.toI32() > transaction.maxLogIndex) {
    // max
    transaction.amount0Out = event.params.amount0Out;
    transaction.amount1Out = event.params.amount1Out;
  } else {
    // min
    transaction.amount0In = event.params.amount0In;
    transaction.amount1In = event.params.amount1In;
  }

  if (event.logIndex.toI32() > transaction.maxLogIndex) {
    transaction.maxLogIndex = event.logIndex.toI32();
  }

  transaction.save();

  // get first
  amount0In = transaction.amount0In;
  amount1In = transaction.amount1In;

  // get latest
  let amount0Out = transaction.amount0Out;
  let amount1Out = transaction.amount1Out;

  let amountIn = amount0In.plus(amount1In);
  let amountOut = amount0Out.plus(amount1Out);

  let slippagePercentIn = amountInMax
    .minus(amountIn)
    .divDecimal(amountIn.toBigDecimal());

  let slippagePercentOut = amountOut
    .minus(amountOutMin)
    .divDecimal(amountOut.toBigDecimal());

  let slippage = slippagePercentIn
    .plus(slippagePercentOut)
    .minus(BigDecimal.fromString("1"));

  let isSlippageBot = slippage.gt(BigDecimal.fromString("0.5001"));
  let isDeadlineBot = deadline > event.block.timestamp.plus(BI_10800);

  let isBot = isSlippageBot || isDeadlineBot;

  let swap = new Swap(
    event.block.hash.toHexString() +
      "-" +
      event.transaction.hash.toHexString() +
      "-" +
      event.logIndex.toHexString(),
  );

  swap.transactionAmountInMax = amountInMax;
  swap.swapAmountIn = amountIn;
  swap.transactionAmountOutMin = amountOutMin;
  swap.swapAmountOut = amountOut;

  swap.fnName = fnName;
  swap.isBot = isBot;
  swap.isSlippageBot = isSlippageBot;
  swap.isDeadlineBot = isDeadlineBot;
  swap.slippage = slippage;
  swap.deadline = deadline;

  swap.txHash = event.transaction.hash;
  swap.logIndex = event.logIndex;
  swap.blockNumber = event.block.number;
  swap.timestamp = event.block.timestamp;

  swap.save();

  if (isBot) {
    let global = getOrCreateGlobal();
    global.botsDetected = global.botsDetected.plus(ONE_BI);
    global.save();
  }
}
