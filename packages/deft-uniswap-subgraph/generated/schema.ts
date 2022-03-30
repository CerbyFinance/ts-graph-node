// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Swap extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Swap entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Swap entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Swap", id.toString(), this);
  }

  static load(id: string): Swap | null {
    return store.get("Swap", id) as Swap | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get feedType(): string {
    let value = this.get("feedType");
    return value.toString();
  }

  set feedType(value: string) {
    this.set("feedType", Value.fromString(value));
  }

  get txHash(): Bytes {
    let value = this.get("txHash");
    return value.toBytes();
  }

  set txHash(value: Bytes) {
    this.set("txHash", Value.fromBytes(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    return value.toBigInt();
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    return value.toBytes();
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get from(): Bytes {
    let value = this.get("from");
    return value.toBytes();
  }

  set from(value: Bytes) {
    this.set("from", Value.fromBytes(value));
  }

  get to(): Bytes {
    let value = this.get("to");
    return value.toBytes();
  }

  set to(value: Bytes) {
    this.set("to", Value.fromBytes(value));
  }

  get cerbyInFtm(): BigDecimal {
    let value = this.get("cerbyInFtm");
    return value.toBigDecimal();
  }

  set cerbyInFtm(value: BigDecimal) {
    this.set("cerbyInFtm", Value.fromBigDecimal(value));
  }

  get cerbyInUsd(): BigDecimal {
    let value = this.get("cerbyInUsd");
    return value.toBigDecimal();
  }

  set cerbyInUsd(value: BigDecimal) {
    this.set("cerbyInUsd", Value.fromBigDecimal(value));
  }

  get amountCerby(): BigDecimal {
    let value = this.get("amountCerby");
    return value.toBigDecimal();
  }

  set amountCerby(value: BigDecimal) {
    this.set("amountCerby", Value.fromBigDecimal(value));
  }

  get amountCerbyInFtm(): BigDecimal {
    let value = this.get("amountCerbyInFtm");
    return value.toBigDecimal();
  }

  set amountCerbyInFtm(value: BigDecimal) {
    this.set("amountCerbyInFtm", Value.fromBigDecimal(value));
  }

  get amountCerbyInUsd(): BigDecimal {
    let value = this.get("amountCerbyInUsd");
    return value.toBigDecimal();
  }

  set amountCerbyInUsd(value: BigDecimal) {
    this.set("amountCerbyInUsd", Value.fromBigDecimal(value));
  }

  get transactionFeeInFtm(): BigDecimal {
    let value = this.get("transactionFeeInFtm");
    return value.toBigDecimal();
  }

  set transactionFeeInFtm(value: BigDecimal) {
    this.set("transactionFeeInFtm", Value.fromBigDecimal(value));
  }

  get transactionFeeInUsd(): BigDecimal {
    let value = this.get("transactionFeeInUsd");
    return value.toBigDecimal();
  }

  set transactionFeeInUsd(value: BigDecimal) {
    this.set("transactionFeeInUsd", Value.fromBigDecimal(value));
  }

  get logIndex(): BigInt {
    let value = this.get("logIndex");
    return value.toBigInt();
  }

  set logIndex(value: BigInt) {
    this.set("logIndex", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    return value.toBigInt();
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }
}

export class Token extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Token entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Token entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Token", id.toString(), this);
  }

  static load(id: string): Token | null {
    return store.get("Token", id) as Token | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get price(): BigDecimal {
    let value = this.get("price");
    return value.toBigDecimal();
  }

  set price(value: BigDecimal) {
    this.set("price", Value.fromBigDecimal(value));
  }
}