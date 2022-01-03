import ec from '../core/keygen';

export default class KeyAddress {
static PRIVATE_ADDRESS = ec.keyFromPrivate('5d4c42907dec40c91bab3480c39032e90049f1a44f3e18c3e07c23e3273995cf');
static PUBLIC_ADDRESS = KeyAddress.PRIVATE_ADDRESS.getPublic('hex');
}