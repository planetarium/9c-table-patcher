export const getRpcNodeList = async (rpcList) => {
  const resp = await fetch("https://download.nine-chronicles.com/9c-launcher-config.json");
  if (resp.status === 200) {
    const r = await resp.json();
    rpcList = r.RemoteNodeList ?? [];
    console.log(`${rpcList.length} nodes detected`);
  } else {
    // setTimeout(getRpcNodeList, 1000 * 10);
    console.log("RPC fetch failed. Please try again later.");
  }
  return await connectRpc(rpcList);
};

export const connectRpc = async (rpcList = []) => {
  if (rpcList.length === 0) {
    return await getRpcNodeList(rpcList);
  } else {
    const connectedRpc = rpcList[Math.floor(Math.random() * rpcList.length)].split(",")[0];
    console.log(`Use ${connectedRpc}`);
    return connectedRpc;
  }
};
