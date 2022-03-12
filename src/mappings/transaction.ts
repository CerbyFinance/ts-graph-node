import { ethereum, BigInt } from '@graphprotocol/graph-ts';
import { Transaction, Pool, poolTransaction } from '../types/schema';
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

export function CreatePoolTransaction(pool: string, currentTransaction: string, event: ethereum.Event): void {
    let transaction = poolTransaction.load(pool + "-" + currentTransaction);
    if(!transaction) {
        transaction = new poolTransaction(pool + "-" + currentTransaction);
        transaction.pool = pool;
        transaction.transaction = currentTransaction;
        transaction.timestamp = event.block.timestamp;

        transaction.save();
    }
}