import Block from './block';

export default class BlockChain {
    chain: Block[];

    constructor() {
        this.chain = [this.generateGenesisBlock()];
    }

    /*
        This method generates the "GENESIS" block, that means is the first block on the chain.    
    */
    generateGenesisBlock(): Block {
        return new Block(0, Date.now().toString(), 'GENESIS_BLOCK', '0');
    }

    /*
        As the name of the method says, just returns the last block in the chain.
    */
    getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    /*
        As the name of the method says, add a new block into the chain.
    */
    addBlock(block: Block) {
        // It's necessary to get the latest block hash and add on the new block previous hash.
        block.previousHash = this.getLatestBlock().hash;

        // And then, it's necessary to calcule the new block hash.
        block.hash = block.calculateHash();
        this.chain.push(block);
    }

    getTotalChainLength(): number {
        return this.chain.length;
    }

    isChainValid(): boolean {
        // The initial chain index can't be 0 because 0 it's the index of the GENESIS block.
        const INITIAL_CHAIN_INDEX = 1;

        // This loop verifies if all the blocks are valid
        for(let index = INITIAL_CHAIN_INDEX; index < this.getTotalChainLength(); index++) {
            const currentBlock = this.chain[index];
            const previousBlock = this.chain[index - 1];

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