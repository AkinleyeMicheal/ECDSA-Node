const bls = require("ethereum-cryptography/bls.js").bls12_381;
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
const { toHex } = require("ethereum-cryptography/utils.js");

function generateAddress() {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = bls.getPublicKey(privateKey);
  const address = "0x" + toHex(keccak256(publicKey).slice(-20));
  return {
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
    address: address,
  };
}
const address1 = generateAddress().address;
const address2 = generateAddress().address;
const address3 = generateAddress().address;

console.log(address1, address2, address3);

// Export the generateAddress function
module.exports = { generateAddress };

// console.log("private key: ", toHex(privateKey));
// console.log("public key: ", toHex(publicKey));
// console.log("address: ", toHex(address));

/* I first create a function for user to generate a random wallet in the frontend and save the private key in a state.
Extract the eth address from the public key and send it to the backend with a custom amount.
Everytime a user wants to send a transaction, user will need to sign the transaction with the private key, derive public key from signature and post messageHash, public key and signature to the backend, then the verification of the signature will be carried out in the backend whether if its coming from a the same wallet that sign the transaction. Then after that, I derive the eth address from the public key then only carry out the plus minus operation.*/
