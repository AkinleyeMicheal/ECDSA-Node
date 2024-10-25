import { useState } from "react";
import server from "./server";
import { bls12_381 as bls } from "ethereum-cryptography/bls.js";
import { toHex, hexToBytes, utf8ToBytes } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    //i started makin changes from here
    const messageBytes = utf8ToBytes(recipient + parseInt(sendAmount));

    // Hash the message
    const hashedMessage = keccak256(messageBytes);

    // Sign the hashed message using the private key
    const signature = bls.sign(toHex(hashedMessage), privateKey);

    // Get the public key (hex-encoded)
    const publicKey = toHex(bls.getPublicKey(privateKey));

    //and it ends here
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature: toHex(signature),
        message: toHex(hashedMessage),
        publicKey,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
