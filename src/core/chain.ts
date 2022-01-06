import Block from './block';
import Transaction from './transaction';
import KeyAddress from '../crypto/keyaddress';
import MiningDificulty from '~/crypto/mining';

export default class Chain {
    static MINING_DIFICULTY = MiningDificulty.lastDificulty;
    static PRIVATE_ADDRESS = KeyAddress.PRIVATE_ADDRESS;
    static PUBLIC_ADDRESS = KeyAddress.PUBLIC_ADDRESS;


    blocks: Block[];
    pendingTransactions: Transaction[];
    miningReward: number;

    constructor() {
        this.blocks = [this.generateGenesisBlock()];
        this.miningReward = 2;
        this.pendingTransactions = [];
    }

    /*
        This method generates the "GENESIS" block, that means is the first block on the chain.
    */
    generateGenesisBlock(): Block {
        return new Block(Date.now().toString(), [], '0');
    }

    /*
        As the name of the method says, just returns the last block in the chain.
    */
    getLatestBlock(): Block {
        return this.blocks[this.blocks.length - 1];
    }

    /*
        As the name of the method says, add a new block into the chain.
    */
    addBlock(block: Block) {
        // It's necessary to get the latest block hash and add on the new block previous hash.
        block.previousHash = this.getLatestBlock().hash;

        // And then, it's necessary to calcule the new block hash.
        block.mine(Chain.MINING_DIFICULTY);
        this.blocks.push(block);
    }

    addTransaction(transaction: Transaction) {

        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('TRANSACTION_MUST_INCLUDE_FROM_AND_TO_ADDRESS');
        }

        if (transaction.fromAddress === transaction.toAddress) {
            throw new Error('TRANSACTION_CANNOT_BE_THE_SAME_FROM_AND_TO_ADDRESS');
        }

        if (!transaction.isValid()) {
            throw new Error('CANNOT_ADD_INVALID_TRANSACTION_TO_THE_CHAIN');
        }

        if (transaction.amount <= 0) {
            throw new Error('AMOUNT_MUST_BE_GREATER_THAN_0');
        }

        if (this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount) {
            throw new Error('NOT_ENOUGH_BALANCE');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address: string) {
        let balance = 0;

        for (const block of this.blocks) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    minePendingTransaction(miningRewardAddress: string) {
        const rewardTransaction = new Transaction(Chain.PUBLIC_ADDRESS, miningRewardAddress, this.miningReward);

        rewardTransaction.sign(Chain.PRIVATE_ADDRESS);

        this.pendingTransactions.push(rewardTransaction);

        let block = new Block(Date.now().toString(), this.pendingTransactions, this.getLatestBlock().hash);

        block.mine(Chain.MINING_DIFICULTY);

        this.addBlock(block);

        this.pendingTransactions = [];
    }

    getTotalChainLength(): number {

        return this.blocks.length;
    }

    isValid(): boolean {
        // The initial chain index can't be 0 because 0 it's the index of the GENESIS block.
        const INITIAL_CHAIN_INDEX = 1;

        // This loop verifies if all the blocks are valid
        for(let index = INITIAL_CHAIN_INDEX; index < this.getTotalChainLength(); index++) {
            const currentBlock = this.blocks[index];
            const previousBlock = this.blocks[index - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            /*
                This verifies if the current hash is the same from the calculated initialized hash.
                This verification is necessary to avoid modifications on the BLOCK.
                If the block was modified, the hash will be different, then the block isn't valid.
            */
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}
