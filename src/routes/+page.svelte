<svelte:head>
    <title>Nine Chronicles Table CSV Patcher</title>
</svelte:head>

<script>
  import FilePond from "svelte-filepond";
  import {createAccount} from '@planetarium/account-raw';
  import {onMount} from "svelte";
  import {connectRpc} from "../utils/rpc.js";
  import {deriveAddress} from "@planetarium/sign";

  let pond;
  let name = "filepond";
  let showPrivateKey = false;
  $: type = showPrivateKey ? "text" : "password";
  let mainnet;
  let privateKey = "";

  onMount(async () => {
    mainnet = await connectRpc();
    // console.log(decode(Buffer.from('du1:ai1eu1:bi2ee')));
  });

  $: gqlNodeMap = {
    "local": "http://localhost",
    "previewnet": "previewnet",
    "mainnet": mainnet
  };
  let network;

  const handlePrivateKeyInput = (e) => {
    privateKey = e.target.value;
  };

  const handleInit = () => {
    console.log("Filepond initialized");
  };

  const handleAddFile = async (err, fileItem) => {
    const table = document.getElementById("csv-table");
    console.log(fileItem.file);
    const reader = new FileReader();
    reader.onload = () => {
      const data = parseCsv(reader.result);
      drawTable(table, data);
    }
    await reader.readAsText(fileItem.file);
    table.innerHTML = "";
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.insertRow();


    console.log(`File added: ${fileItem.file.name}`);
  };

  const parseCsv = (origin) => {
    const data = [];
    const rows = origin.split("\n");
    for (let row of rows) {
      if (row !== "") {
        data.push(row.split(","));
      }
    }
    return data;
  };

  const drawTable = (table, data, header = true) => {
    table.innerHTML = "";

    if (header) {
      const thead = document.createElement("thead");
      thead.insertRow();
      table.append(thead);
      const header = data[0];
      for (let h of header) {
        const th = document.createElement("th");
        th.innerText = h;
        thead.rows[0].append(th);
      }

      data = data.splice(1);
    }

    const tbody = document.createElement("tbody");
    table.append(tbody);

    for (let row of data) {
      const tr = document.createElement("tr");
      for (let col of row) {
        const td = document.createElement("td");
        td.innerText = col;
        tr.append(td);
      }
      tbody.append(tr);
    }
  };

  const handleRemoveFile = (err, fileItem) => {
    const table = document.getElementById("csv-table");
    console.log(`File ${fileItem.file.name} unloaded`);
    table.innerHTML = "";
  };

  const handleSelectNetwork = (e) => {
    console.log(e.target.value);
    network = gqlNodeMap[e.target.value];
    console.log(network);
  };

  const sign = async () => {
    console.log(privateKey);
    const account = createAccount(privateKey);
    console.log(account);
    const address = await deriveAddress(account);
    console.log(`address: ${address}`);
    const query = `{transaction {nextTxNonce(address: "${address}")}}`;
    const resp = await fetch(
      `http://${network}/graphql`,
      {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: query})
      }
    );
    if (resp.status === 200) {
      console.log(await resp.json());
    } else {
      console.log(`Fetch failed: ${resp.status}`);
      console.log(await resp.text());
    }
  };
</script>

<h1>
    Make new transaction to patch table csv
</h1>

<div class="flex">
    <div class="csv-part flex-1 w-1/2">
        <FilePond bind:this={pond} {name}
                  allowmultiple=false instantupload=false
                  oninit={handleInit} onaddfile={handleAddFile}
                  onremovefile={handleRemoveFile}
        />
        <table id="csv-table"></table>
    </div>
    <div class="sign-part flex-1 w-1/2">
        <div>
            <label for="network" class="block text-sm font-medium text-gray-700">Country</label>
            <select on:change={handleSelectNetwork} id="network" name="network" autocomplete="country-name"
                    class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm">
                <option value="local">Local Node</option>
                <option value="previewnet">Previewnet</option>
                <option value="mainnet">Mainnet</option>
            </select>
        </div>
        <div>
            <label for="private-key">PrivateKey</label>
            <input id="private-key" class="block w-full rounded-md broder-gray-300 "
                   {type} {privateKey} on:input={handlePrivateKeyInput}>
        </div>
        <button on:click={() => showPrivateKey = !showPrivateKey}>{showPrivateKey ? "Hide" : "Show"}</button>
        <button on:click={sign}>sign</button>
    </div>
</div>
