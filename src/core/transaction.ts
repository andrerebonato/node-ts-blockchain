import SHA256 from 'crypto-js/sha256';

import ec from './keygen';

export default class Transaction {
    signature?: string;
    fromAddress: string;
    toAddress: string;
    amount: number;

    constructor(fromAddress: string, toAddress: string, amount: number) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(`${this.fromAddress}-${this.toAddress}-${this.amount}`).toString();
    }

    sign(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error('CANNOT_SIGN_TRANSACTION_FOR_OTHER_WALLETS');
        }

        const transactionHash = this.calculateHash();

        const sign = signingKey.sign(transactionHash, 'base64');

        console.log('Sign: ', sign.toDER('hex'));

        this.signature = sign.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true;

        console.log("Transaction signature: ", this);

        if (!this.signature || this.signature.length === 0) {
            throw new Error('NO_SIGNATURE_IN_THIS_TRANSACTION');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');

        return publicKey.verify(
            this.calculateHash(),
            this.signature,
        );
    }
}