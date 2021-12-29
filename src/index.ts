import Chain from './core/chain';
import Transaction from "./core/transaction";

import ec from './core/keygen';

const myKey = ec.keyFromPrivate('7c4c45907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
const myWalletAddress = myKey.getPublic('hex');

const chain = new Chain();

chain.minePendingTransaction(
    myWalletAddress
);

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 1);
tx1.sign(myKey);

chain.addTransaction(tx1);

console.log('Rebonato balance', chain.getBalanceOfAddress(myWalletAddress));

console.log('Is valid chain: ', chain.isValid());

