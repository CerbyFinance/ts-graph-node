import { BridgeTransfer, Global, Proof } from "../generated/schema";
import {
  ApprovedTransaction,
  BulkApprovedTransactions,
  ProofOfBurn,
  ProofOfMint,
} from "../generated/SourceChain/CrossChainBridge";
import {
  BI_18,
  convertTokenToDecimal,
  ONE_BI,
  ZERO_BD,
  ZERO_BI,
} from "./helpers";

function getOrCreateBridgeTransfer(id: string): BridgeTransfer | null {
  let transfer = BridgeTransfer.load(id);

  if (transfer == null) {
    transfer = new BridgeTransfer(id);
    transfer.status = "Created";
    transfer.save();
  }

  return transfer;
}

function getOrCreateGlobal(): Global | null {
  let global = Global.load("1");

  if (global == null) {
    global = new Global("1");
    global.mintedCount = ZERO_BI;
    global.mintedAmount = ZERO_BD;

    // fetching directly from contract
    // global.currentFee = BigDecimal.fromString("0");

    global.burnedCount = ZERO_BI;
    global.burnedAmount = ZERO_BD;

    global.approvedCount = ZERO_BI;
    global.chargedFee = ZERO_BD;
    global.recentApprovedProof = "";
    global.save();
  }

  return global;
}

export function handleProofOfBurn(event: ProofOfBurn): void {
  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let proofHash = event.params.transactionHash.toHexString();

  let bridgeTransfer = getOrCreateBridgeTransfer(proofHash);
  bridgeTransfer.status = "Burned";

  let burnedAmount = convertTokenToDecimal(event.params.amount, BI_18);
  let amountAsFee = convertTokenToDecimal(event.params.amountAsFee, BI_18);

  let global = getOrCreateGlobal();
  global.burnedCount = global.burnedCount.plus(ONE_BI);
  global.burnedAmount = global.burnedAmount.plus(burnedAmount);

  let proof = new Proof(proofHash);
  proof.src = event.params.sourceChain;
  proof.dest = event.params.destinationChain;
  proof.token = event.params.token.toHexString();
  proof.nonce = event.params.currentNonce;
  proof.type = "Burn";
  proof.sender = event.transaction.from;
  proof.amount = burnedAmount;
  proof.fee = amountAsFee;
  proof.txFee = convertTokenToDecimal(gasPrice.times(gasUsed), BI_18);
  proof.txHash = event.transaction.hash;
  proof.logIndex = event.logIndex;
  proof.blockNumber = event.block.number;
  proof.timestamp = event.block.timestamp;

  bridgeTransfer.save();
  global.save();
  proof.save();
}

export function handleProofOfMint(event: ProofOfMint): void {
  let gasPrice = event.transaction.gasPrice;
  let gasUsed = event.transaction.gasUsed;

  let proofHash = event.params.transactionHash.toHexString();

  let bridgeTransfer = getOrCreateBridgeTransfer(proofHash);
  bridgeTransfer.status = "Executed";

  let mintedAmount = convertTokenToDecimal(event.params.finalAmount, BI_18);
  let chargedFee = convertTokenToDecimal(event.params.amountAsFee, BI_18);

  let global = getOrCreateGlobal();
  global.mintedCount = global.mintedCount.plus(ONE_BI);
  global.mintedAmount = global.mintedAmount.plus(mintedAmount);
  global.chargedFee = global.chargedFee.plus(chargedFee);

  let proof = new Proof(proofHash);
  proof.nonce = null; // find from burn
  proof.token = event.params.token.toHexString();
  proof.type = "Mint";
  proof.sender = event.transaction.from;
  proof.amount = convertTokenToDecimal(event.params.finalAmount, BI_18);
  proof.fee = chargedFee;
  proof.txFee = convertTokenToDecimal(gasPrice.times(gasUsed), BI_18);
  proof.txHash = event.transaction.hash;
  proof.logIndex = event.logIndex;
  proof.blockNumber = event.block.number;
  proof.timestamp = event.block.timestamp;

  bridgeTransfer.save();
  global.save();
  proof.save();
}

export function handleApprovedTransaction(event: ApprovedTransaction): void {
  let proofHash = event.params.transactionHash.toHexString();

  let global = getOrCreateGlobal();
  global.approvedCount = global.approvedCount.plus(ONE_BI);

  let bridgeTransfer = getOrCreateBridgeTransfer(proofHash);
  bridgeTransfer.status = "Approved";

  bridgeTransfer.save();
  global.save();
}

let ZERO = "0x0";
let ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
// prettier-ignore
let ZERO_ADDRESS_2 = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function handleBulkApprovedTransaction(
  event: BulkApprovedTransactions,
): void {
  let global = getOrCreateGlobal();
  let transactionHashes = event.params.transactionHashes;

  for (let i = 0; i < transactionHashes.length; i++) {
    let proofHash = transactionHashes[i].toHexString();

    if (
      proofHash == ZERO ||
      proofHash == ZERO_ADDRESS ||
      proofHash == ZERO_ADDRESS_2
    ) {
      continue;
    }

    global.approvedCount = global.approvedCount.plus(ONE_BI);
    global.recentApprovedProof = proofHash;

    let bridgeTransfer = getOrCreateBridgeTransfer(proofHash);
    bridgeTransfer.status = "Approved";
    bridgeTransfer.save();
  }

  global.save();
}
