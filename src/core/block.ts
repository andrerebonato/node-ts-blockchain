import SHA256 from 'crypto-js/sha256';

export default class Block {
    index: number;
    timestamp: string;
    data: any;
    hash: string;
    previousHash: string;

    constructor (index: number, timestamp: string, data: any, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    /*
        Generate the hash of the block containing all the block content.
    */
    calculateHash() {
        return SHA256(
            `${this.index}-${this.previousHash}-${this.timestamp}-${JSON.stringify(this.data)}`
        ).toString();
    }
}