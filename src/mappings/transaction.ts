import { ethereum, BigInt } from '@graphprotocol/graph-ts';
import { Transaction } from '../types/schema';
import { addTransaction, createOrLoadGlobal } from './snapshots/global/Global';

export function getOrCreateTransaction(event: ethereum.Event): string {
    let transaction = Transaction.load(event.transaction.hash.toHexString());
    if(!transaction) {
        transaction = new Transaction(event.transaction.hash.toHexString());
        transaction.timestamp = event.block.timestamp;
        transaction.blockNumber = event.block.number;
        transaction.gasPrice = event.transaction.gasPrice;
        transaction.gasUsed = event.transaction.gasLimit;
        transaction.from = event.transaction.from;
        transaction.save();
        addTransaction(1, event.block.timestamp);
    }
    return event.transaction.hash.toHexString();
}