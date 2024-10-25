const express = require("express");
//
const { bls12_381: bls } = require("ethereum-cryptography/bls.js");
const { hexToBytes, toHex } = require("ethereum-cryptography/utils.js");
const { keccak256 } = require("ethereum-cryptography/keccak.js");
//
const { generateAddress } = require("./scripts/generate.js");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const address1 = generateAddress();
const address2 = generateAddress();
const address3 = generateAddress();

console.log(address1, address2, address3);

const balances = {
  [address1.address]: 100,
  [address2.address]: 50,
  [address3.address]: 90,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //get the signed transaction from the client side and recoveer the public address to
  //here, i added the signature and message
  const { sender, recipient, amount, signature, message, publicKey } = req.body;

  // i made major changes here
  try {
    console.log("Received transfer request:", {
      sender,
      recipient,
      amount,
      signature,
      message,
      publicKey,
    });

    // Step 3: Verify the signature
    const isValid = bls.verify(signature, message, publicKey);
    console.log("Signature validity:", isValid);

    if (!isValid) {
      return res.status(400).send({ message: "Invalid signature!" });
    }
    //and stopped here

    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } catch (ex) {
    res.status(500).send({
      message: "Error verifying signature or processing transaction.",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
