// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ApprovedTransaction extends ethereum.Event {
  get params(): ApprovedTransaction__Params {
    return new ApprovedTransaction__Params(this);
  }
}

export class ApprovedTransaction__Params {
  _event: ApprovedTransaction;

  constructor(event: ApprovedTransaction) {
    this._event = event;
  }

  get transactionHash(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }
}

export class BulkApprovedTransactions extends ethereum.Event {
  get params(): BulkApprovedTransactions__Params {
    return new BulkApprovedTransactions__Params(this);
  }
}

export class BulkApprovedTransactions__Params {
  _event: BulkApprovedTransactions;

  constructor(event: BulkApprovedTransactions) {
    this._event = event;
  }

  get transactionHashes(): Array<Bytes> {
    return this._event.parameters[0].value.toBytesArray();
  }
}

export class FeeUpdated extends ethereum.Event {
  get params(): FeeUpdated__Params {
    return new FeeUpdated__Params(this);
  }
}

export class FeeUpdated__Params {
  _event: FeeUpdated;

  constructor(event: FeeUpdated) {
    this._event = event;
  }

  get newFeePercent(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }
}

export class ProofOfBurn extends ethereum.Event {
  get params(): ProofOfBurn__Params {
    return new ProofOfBurn__Params(this);
  }
}

export class ProofOfBurn__Params {
  _event: ProofOfBurn;

  constructor(event: ProofOfBurn) {
    this._event = event;
  }

  get addr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get amountAsFee(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get currentNonce(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get sourceChain(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get destinationChain(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get transactionHash(): Bytes {
    return this._event.parameters[7].value.toBytes();
  }
}

export class ProofOfMint extends ethereum.Event {
  get params(): ProofOfMint__Params {
    return new ProofOfMint__Params(this);
  }
}

export class ProofOfMint__Params {
  _event: ProofOfMint;

  constructor(event: ProofOfMint) {
    this._event = event;
  }

  get addr(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get token(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get amountAsFee(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get finalAmount(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get transactionHash(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }
}

export class RoleAdminChanged extends ethereum.Event {
  get params(): RoleAdminChanged__Params {
    return new RoleAdminChanged__Params(this);
  }
}

export class RoleAdminChanged__Params {
  _event: RoleAdminChanged;

  constructor(event: RoleAdminChanged) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get previousAdminRole(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get newAdminRole(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }
}

export class RoleGranted extends ethereum.Event {
  get params(): RoleGranted__Params {
    return new RoleGranted__Params(this);
  }
}

export class RoleGranted__Params {
  _event: RoleGranted;

  constructor(event: RoleGranted) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get account(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class RoleRevoked extends ethereum.Event {
  get params(): RoleRevoked__Params {
    return new RoleRevoked__Params(this);
  }
}

export class RoleRevoked__Params {
  _event: RoleRevoked;

  constructor(event: RoleRevoked) {
    this._event = event;
  }

  get role(): Bytes {
    return this._event.parameters[0].value.toBytes();
  }

  get account(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get sender(): Address {
    return this._event.parameters[2].value.toAddress();
  }
}

export class CrossChainBridge extends ethereum.SmartContract {
  static bind(address: Address): CrossChainBridge {
    return new CrossChainBridge("CrossChainBridge", address);
  }

  ROLE_ADMIN(): Bytes {
    let result = super.call("ROLE_ADMIN", "ROLE_ADMIN():(bytes32)", []);

    return result[0].toBytes();
  }

  try_ROLE_ADMIN(): ethereum.CallResult<Bytes> {
    let result = super.tryCall("ROLE_ADMIN", "ROLE_ADMIN():(bytes32)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  ROLE_APPROVER(): Bytes {
    let result = super.call("ROLE_APPROVER", "ROLE_APPROVER():(bytes32)", []);

    return result[0].toBytes();
  }

  try_ROLE_APPROVER(): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "ROLE_APPROVER",
      "ROLE_APPROVER():(bytes32)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  beneficiaryAddress(): Address {
    let result = super.call(
      "beneficiaryAddress",
      "beneficiaryAddress():(address)",
      []
    );

    return result[0].toAddress();
  }

  try_beneficiaryAddress(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "beneficiaryAddress",
      "beneficiaryAddress():(address)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  currentNonce(param0: Address): BigInt {
    let result = super.call("currentNonce", "currentNonce(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_currentNonce(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "currentNonce",
      "currentNonce(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getFeeDependingOnDestinationChainId(
    tokenAddr: Address,
    destinationChainId: BigInt
  ): BigInt {
    let result = super.call(
      "getFeeDependingOnDestinationChainId",
      "getFeeDependingOnDestinationChainId(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(tokenAddr),
        ethereum.Value.fromUnsignedBigInt(destinationChainId)
      ]
    );

    return result[0].toBigInt();
  }

  try_getFeeDependingOnDestinationChainId(
    tokenAddr: Address,
    destinationChainId: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getFeeDependingOnDestinationChainId",
      "getFeeDependingOnDestinationChainId(address,uint256):(uint256)",
      [
        ethereum.Value.fromAddress(tokenAddr),
        ethereum.Value.fromUnsignedBigInt(destinationChainId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRoleAdmin(role: Bytes): Bytes {
    let result = super.call("getRoleAdmin", "getRoleAdmin(bytes32):(bytes32)", [
      ethereum.Value.fromFixedBytes(role)
    ]);

    return result[0].toBytes();
  }

  try_getRoleAdmin(role: Bytes): ethereum.CallResult<Bytes> {
    let result = super.tryCall(
      "getRoleAdmin",
      "getRoleAdmin(bytes32):(bytes32)",
      [ethereum.Value.fromFixedBytes(role)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytes());
  }

  getRoleMember(role: Bytes, index: BigInt): Address {
    let result = super.call(
      "getRoleMember",
      "getRoleMember(bytes32,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(role),
        ethereum.Value.fromUnsignedBigInt(index)
      ]
    );

    return result[0].toAddress();
  }

  try_getRoleMember(role: Bytes, index: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getRoleMember",
      "getRoleMember(bytes32,uint256):(address)",
      [
        ethereum.Value.fromFixedBytes(role),
        ethereum.Value.fromUnsignedBigInt(index)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  getRoleMemberCount(role: Bytes): BigInt {
    let result = super.call(
      "getRoleMemberCount",
      "getRoleMemberCount(bytes32):(uint256)",
      [ethereum.Value.fromFixedBytes(role)]
    );

    return result[0].toBigInt();
  }

  try_getRoleMemberCount(role: Bytes): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "getRoleMemberCount",
      "getRoleMemberCount(bytes32):(uint256)",
      [ethereum.Value.fromFixedBytes(role)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getUtilsContractAtPos(_pos: BigInt): Address {
    let result = super.call(
      "getUtilsContractAtPos",
      "getUtilsContractAtPos(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_pos)]
    );

    return result[0].toAddress();
  }

  try_getUtilsContractAtPos(_pos: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "getUtilsContractAtPos",
      "getUtilsContractAtPos(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(_pos)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  hasRole(role: Bytes, account: Address): boolean {
    let result = super.call("hasRole", "hasRole(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(role),
      ethereum.Value.fromAddress(account)
    ]);

    return result[0].toBoolean();
  }

  try_hasRole(role: Bytes, account: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("hasRole", "hasRole(bytes32,address):(bool)", [
      ethereum.Value.fromFixedBytes(role),
      ethereum.Value.fromAddress(account)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  supportsInterface(interfaceId: Bytes): boolean {
    let result = super.call(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );

    return result[0].toBoolean();
  }

  try_supportsInterface(interfaceId: Bytes): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "supportsInterface",
      "supportsInterface(bytes4):(bool)",
      [ethereum.Value.fromFixedBytes(interfaceId)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  transactionStorage(param0: Bytes): i32 {
    let result = super.call(
      "transactionStorage",
      "transactionStorage(bytes32):(uint8)",
      [ethereum.Value.fromFixedBytes(param0)]
    );

    return result[0].toI32();
  }

  try_transactionStorage(param0: Bytes): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "transactionStorage",
      "transactionStorage(bytes32):(uint8)",
      [ethereum.Value.fromFixedBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class BulkMarkTransactionsAsApprovedCall extends ethereum.Call {
  get inputs(): BulkMarkTransactionsAsApprovedCall__Inputs {
    return new BulkMarkTransactionsAsApprovedCall__Inputs(this);
  }

  get outputs(): BulkMarkTransactionsAsApprovedCall__Outputs {
    return new BulkMarkTransactionsAsApprovedCall__Outputs(this);
  }
}

export class BulkMarkTransactionsAsApprovedCall__Inputs {
  _call: BulkMarkTransactionsAsApprovedCall;

  constructor(call: BulkMarkTransactionsAsApprovedCall) {
    this._call = call;
  }

  get transactionHashes(): Array<Bytes> {
    return this._call.inputValues[0].value.toBytesArray();
  }
}

export class BulkMarkTransactionsAsApprovedCall__Outputs {
  _call: BulkMarkTransactionsAsApprovedCall;

  constructor(call: BulkMarkTransactionsAsApprovedCall) {
    this._call = call;
  }
}

export class BulkUpdateFeeDependingOnDestinationChainIdCall extends ethereum.Call {
  get inputs(): BulkUpdateFeeDependingOnDestinationChainIdCall__Inputs {
    return new BulkUpdateFeeDependingOnDestinationChainIdCall__Inputs(this);
  }

  get outputs(): BulkUpdateFeeDependingOnDestinationChainIdCall__Outputs {
    return new BulkUpdateFeeDependingOnDestinationChainIdCall__Outputs(this);
  }
}

export class BulkUpdateFeeDependingOnDestinationChainIdCall__Inputs {
  _call: BulkUpdateFeeDependingOnDestinationChainIdCall;

  constructor(call: BulkUpdateFeeDependingOnDestinationChainIdCall) {
    this._call = call;
  }

  get bulkFees(): Array<
    BulkUpdateFeeDependingOnDestinationChainIdCallBulkFeesStruct
  > {
    return this._call.inputValues[0].value.toTupleArray<
      BulkUpdateFeeDependingOnDestinationChainIdCallBulkFeesStruct
    >();
  }
}

export class BulkUpdateFeeDependingOnDestinationChainIdCall__Outputs {
  _call: BulkUpdateFeeDependingOnDestinationChainIdCall;

  constructor(call: BulkUpdateFeeDependingOnDestinationChainIdCall) {
    this._call = call;
  }
}

export class BulkUpdateFeeDependingOnDestinationChainIdCallBulkFeesStruct extends ethereum.Tuple {
  get token(): Address {
    return this[0].toAddress();
  }

  get chainId(): BigInt {
    return this[1].toBigInt();
  }

  get amountAsFee(): BigInt {
    return this[2].toBigInt();
  }
}

export class BurnAndCreateProofCall extends ethereum.Call {
  get inputs(): BurnAndCreateProofCall__Inputs {
    return new BurnAndCreateProofCall__Inputs(this);
  }

  get outputs(): BurnAndCreateProofCall__Outputs {
    return new BurnAndCreateProofCall__Outputs(this);
  }
}

export class BurnAndCreateProofCall__Inputs {
  _call: BurnAndCreateProofCall;

  constructor(call: BurnAndCreateProofCall) {
    this._call = call;
  }

  get token(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get destinationChainId(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }
}

export class BurnAndCreateProofCall__Outputs {
  _call: BurnAndCreateProofCall;

  constructor(call: BurnAndCreateProofCall) {
    this._call = call;
  }
}

export class GrantRoleCall extends ethereum.Call {
  get inputs(): GrantRoleCall__Inputs {
    return new GrantRoleCall__Inputs(this);
  }

  get outputs(): GrantRoleCall__Outputs {
    return new GrantRoleCall__Outputs(this);
  }
}

export class GrantRoleCall__Inputs {
  _call: GrantRoleCall;

  constructor(call: GrantRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class GrantRoleCall__Outputs {
  _call: GrantRoleCall;

  constructor(call: GrantRoleCall) {
    this._call = call;
  }
}

export class GrantRolesBulkCall extends ethereum.Call {
  get inputs(): GrantRolesBulkCall__Inputs {
    return new GrantRolesBulkCall__Inputs(this);
  }

  get outputs(): GrantRolesBulkCall__Outputs {
    return new GrantRolesBulkCall__Outputs(this);
  }
}

export class GrantRolesBulkCall__Inputs {
  _call: GrantRolesBulkCall;

  constructor(call: GrantRolesBulkCall) {
    this._call = call;
  }

  get roles(): Array<GrantRolesBulkCallRolesStruct> {
    return this._call.inputValues[0].value.toTupleArray<
      GrantRolesBulkCallRolesStruct
    >();
  }
}

export class GrantRolesBulkCall__Outputs {
  _call: GrantRolesBulkCall;

  constructor(call: GrantRolesBulkCall) {
    this._call = call;
  }
}

export class GrantRolesBulkCallRolesStruct extends ethereum.Tuple {
  get role(): Bytes {
    return this[0].toBytes();
  }

  get addr(): Address {
    return this[1].toAddress();
  }
}

export class MarkTransactionAsApprovedCall extends ethereum.Call {
  get inputs(): MarkTransactionAsApprovedCall__Inputs {
    return new MarkTransactionAsApprovedCall__Inputs(this);
  }

  get outputs(): MarkTransactionAsApprovedCall__Outputs {
    return new MarkTransactionAsApprovedCall__Outputs(this);
  }
}

export class MarkTransactionAsApprovedCall__Inputs {
  _call: MarkTransactionAsApprovedCall;

  constructor(call: MarkTransactionAsApprovedCall) {
    this._call = call;
  }

  get transactionHash(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class MarkTransactionAsApprovedCall__Outputs {
  _call: MarkTransactionAsApprovedCall;

  constructor(call: MarkTransactionAsApprovedCall) {
    this._call = call;
  }
}

export class MintWithBurnProofCall extends ethereum.Call {
  get inputs(): MintWithBurnProofCall__Inputs {
    return new MintWithBurnProofCall__Inputs(this);
  }

  get outputs(): MintWithBurnProofCall__Outputs {
    return new MintWithBurnProofCall__Outputs(this);
  }
}

export class MintWithBurnProofCall__Inputs {
  _call: MintWithBurnProofCall;

  constructor(call: MintWithBurnProofCall) {
    this._call = call;
  }

  get sourceProofOfBurn(): MintWithBurnProofCallSourceProofOfBurnStruct {
    return this._call.inputValues[0].value.toTuple() as MintWithBurnProofCallSourceProofOfBurnStruct;
  }
}

export class MintWithBurnProofCall__Outputs {
  _call: MintWithBurnProofCall;

  constructor(call: MintWithBurnProofCall) {
    this._call = call;
  }
}

export class MintWithBurnProofCallSourceProofOfBurnStruct extends ethereum.Tuple {
  get amountToBridge(): BigInt {
    return this[0].toBigInt();
  }

  get amountAsFee(): BigInt {
    return this[1].toBigInt();
  }

  get sourceChainId(): BigInt {
    return this[2].toBigInt();
  }

  get sourceNonce(): BigInt {
    return this[3].toBigInt();
  }

  get sourceTokenAddr(): Address {
    return this[4].toAddress();
  }

  get transactionHash(): Bytes {
    return this[5].toBytes();
  }
}

export class RenounceRoleCall extends ethereum.Call {
  get inputs(): RenounceRoleCall__Inputs {
    return new RenounceRoleCall__Inputs(this);
  }

  get outputs(): RenounceRoleCall__Outputs {
    return new RenounceRoleCall__Outputs(this);
  }
}

export class RenounceRoleCall__Inputs {
  _call: RenounceRoleCall;

  constructor(call: RenounceRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RenounceRoleCall__Outputs {
  _call: RenounceRoleCall;

  constructor(call: RenounceRoleCall) {
    this._call = call;
  }
}

export class RevokeRoleCall extends ethereum.Call {
  get inputs(): RevokeRoleCall__Inputs {
    return new RevokeRoleCall__Inputs(this);
  }

  get outputs(): RevokeRoleCall__Outputs {
    return new RevokeRoleCall__Outputs(this);
  }
}

export class RevokeRoleCall__Inputs {
  _call: RevokeRoleCall;

  constructor(call: RevokeRoleCall) {
    this._call = call;
  }

  get role(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }

  get account(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class RevokeRoleCall__Outputs {
  _call: RevokeRoleCall;

  constructor(call: RevokeRoleCall) {
    this._call = call;
  }
}

export class UpdateBeneficiaryAddressCall extends ethereum.Call {
  get inputs(): UpdateBeneficiaryAddressCall__Inputs {
    return new UpdateBeneficiaryAddressCall__Inputs(this);
  }

  get outputs(): UpdateBeneficiaryAddressCall__Outputs {
    return new UpdateBeneficiaryAddressCall__Outputs(this);
  }
}

export class UpdateBeneficiaryAddressCall__Inputs {
  _call: UpdateBeneficiaryAddressCall;

  constructor(call: UpdateBeneficiaryAddressCall) {
    this._call = call;
  }

  get newBeneficiaryAddr(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class UpdateBeneficiaryAddressCall__Outputs {
  _call: UpdateBeneficiaryAddressCall;

  constructor(call: UpdateBeneficiaryAddressCall) {
    this._call = call;
  }
}