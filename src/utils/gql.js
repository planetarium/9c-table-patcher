import {deriveAddress, getEncodedPublicKey} from "@planetarium/sign";
import {sleep} from "./util.js";

const executeQuery = async (network, query) => {
  try {
    return await fetch(
      `${network}/graphql`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: query})
      }
    );
  } catch (e) {
    alert(`Error Occurred: ${e}`)
  }
}

export const getNextNonce = async (account, network) => {
  const address = await deriveAddress(account);
  let nonce = -1;
  const query = `{transaction {nextTxNonce(address: "${address}")}}`;
  let resp = await executeQuery(network, query);
  if (resp.status === 200) {
    const json = await resp.json();
    nonce = json.data.transaction.nextTxNonce;
  } else {
    alert(await resp.text());
  }
  return nonce;
};

export const createActionTx = async (account, csvName, csvData, validUntil, network) => {
  const query = `{actionTxQuery(
    publicKey: "${await getEncodedPublicKey(account)}",
    nonce: ${await getNextNonce(account, network)},
    timestamp: "${validUntil.plus({days:1}).toFormat("yyyy-MM-dd'T'HH:mm:ssZZ")}"
    ){patchTableSheet(
    tableName: "${csvName}",
    tableCsv: "${csvData.trim().replaceAll("\r", "").replaceAll('\n', '\\n')}"
    )}}`;
  console.log(query);
  const resp = await executeQuery(network, query);
  if (resp.status === 200) {
    const json = await resp.json();
    if (json.errors) {
      console.log(json.errors);
      alert(`Error Occurred: ${json.errors[0].message}`);
      return null;
    }
    return json.data.actionTxQuery.patchTableSheet;
  } else {
    alert(`Action Create Failed: ${await resp.text()}`);
    return null;
  }
};

export const stageTransaction = async (signedTx, network) => {
  const query = `mutation{stageTransaction(payload: "${signedTx}")}`;
  const resp = await executeQuery(network, query);
  if (resp.status === 200) {
    const json = await resp.json();
    console.log(json);
    return json.data.stageTransaction;
  } else {
    alert(`Stage transaction failed: ${await resp.text()}`);
    return null;
  }
};

export const waitForMining = async (txId, network) => {
  let mined = false;
  let json = null;
  const query = `{transaction{transactionResult(
    txId: "${txId}"
    ) {
    txStatus
    blockIndex
    blockHash
    exceptionName
    }}}`;

  let resp = await executeQuery(network, query);
  if (resp.status === 200) {
    json = await resp.json();
    json = json.data.transaction.transactionResult;
    console.log(json);
    mined = !(json.txStatus === "STAGING");
  }
  while (!mined) {
    console.log("waiting for 5 second to retry...");
    await sleep(5);
    resp = await executeQuery(network, query);
    if (resp.status === 200) {
      json = await resp.json();
      json = json.data.transaction.transactionResult;
      console.log(json);
      mined = !(json.txStatus === "STAGING");
    }
  }
  return json;
};
