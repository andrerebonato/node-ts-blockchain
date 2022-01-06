import SHA256 from 'crypto-js/sha256';

import Transaction from './transaction';

export default class Block {
    timestamp: string;
    transactions: Transaction[];
    hash: string;
    previousHash: string;
    nonce: number;

    constructor (timestamp: string, transactions: Transaction[], previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /*
        Generate the hash of the block containing all the block content.
    */
    calculateHash() {
        return SHA256(
            `${this.nonce}-${this.previousHash}-${this.timestamp}-${JSON.stringify(this.transactions)}`
        ).toString();
    }

    mine(difficulty: number) {
        console.log(`Mining block ${this.hash} with difficulty: ${difficulty}`);

        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block ${this.hash} has been mined.`);
    }

    hasValidTransactions() {
        for (const transaction of this.transactions) {
            if (!transaction.isValid()) {
                return false;
            }
        }

        return true;
    }

}