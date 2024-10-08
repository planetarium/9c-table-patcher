<svelte:head>
  <title>Nine Chronicles Table CSV Patcher</title>
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</svelte:head>

<script>
  import FilePond from "svelte-filepond";
  import {createAccount} from '@planetarium/account-raw';
  import {signTransaction} from "@planetarium/sign";
  import {DateTime} from "luxon";
  import {parseCsv} from "../utils/util.js";
  import {
    Alert,
    Button,
    Heading,
    Input,
    Label,
    Select,
    Spinner,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Textarea
  } from "flowbite-svelte";
  import {handleAddFile, handleInit, handleRemoveFile} from "../utils/filepond.js";
  import {createActionTx, stageTransaction, waitForMining} from "../utils/gql.js";
  import {CircleExclamationSolid, EyeRegular} from "svelte-awesome-icons";
  import {onMount} from "svelte";

  let pond;
  let name = "filepond";

  let planets = {
    "internal": {
      "0x100000000000": {
        "name": "Odin (Internal)",
        "url": "https://odin-internal-rpc-1.nine-chronicles.com/graphql"
      },
      "0x100000000001": {
        "name": "Heimdall (Internal)",
        "url": "https://heimdall-internal-rpc-1.nine-chronicles.com/graphql"
      },
      "0x100000000002": {
        "name": "Idun (Internal)",
        "url": "https://idun-internal-rpc-1.nine-chronicles.com/graphql"
      },
    },
    "preview": {
      "0x100000000000": {
        "name": "Odin (Preview)",
        "url": "https://odin-preview-rpc-1.nine-chronicles.com/graphql"
      },
      "0x100000000001": {
        "name": "Heimdall (Preview)",
        "url": "https://heimdall-preview-rpc-1.nine-chronicles.com/graphql"
      }
    },
    "mainnet": {
      "0x000000000000": {
        "name": "Odin",
        "url": "https://odin-full-state.nine-chronicles.com/graphql"
      },
      "0x000000000001": {
        "name": "Heimdall",
        "url": "https://heimdall-full-state.nine-chronicles.com/graphql"
      }
    }
  };

  let prevPlanet;
  let selectedPlanet;

  let prevNetwork;
  let selectedNetwork;
  const gqlNodeList = [
    {value: "internal", name: "Internal Network"},
    {value: "preview", name: "Preview Network"},
    {value: "mainnet", name: "Mainnet"}
  ];
  let targetUrl = "";

  let privateKey = "";
  let account;
  let validPrivateKey;
  $: {
    try {
      account = createAccount(privateKey);
      validPrivateKey = true;
    } catch (e) {
      validPrivateKey = false;
    }
  }
  $: account = privateKey ? createAccount(privateKey) : null;

  let csvName = null;
  let csvData = null;
  $: thead = parseCsv(csvData)[0] ?? [];
  $: tbody = parseCsv(csvData).slice(1) ?? [];

  let validUntil = DateTime.utc().set({hour: 0, minute: 0, second: 0}).plus({days: 30});

  let signedTx = "";
  let txId = null;

  let signed = false;
  let showSigned = false;
  let signInProgress = false;
  let deployInProgress = false;

  const reset = () => {
    csvName = null;
    csvData = null;
    signed = false;
    showSigned = false;
    signedTx = "";
    txId = null;
    pond.removeFiles();
  }

  onMount(async () => {
  });

  const sign = async () => {
    if (!(csvData && selectedNetwork && account)) {
      alert("Please check uploaded CSV and selected network");
      return;
    }
    signInProgress = true;
    const unsignedTx = await createActionTx(account, csvName, csvData, validUntil, targetUrl);
    if (!unsignedTx) {
      return;
    }
    signed = true;
    signedTx = await signTransaction(unsignedTx, account);
    signInProgress = false;
    return unsignedTx;
  };

  const download = () => {
    const txBlob = new Blob([signedTx], {type: "text/plain"});
    const downloadUrl = window.URL.createObjectURL(txBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download =
        `signedTx_${csvName}_create_${DateTime.utc().toISO()}_until_${validUntil.toFormat("yyyy-MM-dd")}`;
    downloadLink.href = downloadUrl;
    downloadLink.click();
  };

  const deploy = async (e) => {
    const result = confirm(`Deploy this csv data to ${selectedNetwork}?\n(${targetUrl})`);
    if (!result) {
      return;
    }

    if (targetUrl.includes("full-state")) {
      const result = confirm(`It seems you're deploying to mainnet. Are you sure?\n(${targetUrl})`);
      if (!result) {
        return;
      }
    }

    try {
      deployInProgress = true;
      txId = await stageTransaction(signedTx, targetUrl);
      if (!txId) {
        return;
      }

      const txResult = await waitForMining(txId, targetUrl);
      if (txResult.errors) {
        alert(`Mining monitor failed: ${txResult.errors[0].message}`);
        return;
      }
      if (txResult.txStatus === "SUCCESS") {
        alert(`Tx added to block: ${txResult.blockIndex}`);
        reset();
      } else {
        alert(`Tx add failed: ${txResult.txStatus}::${txResult.exceptionNames[0]}}`);
      }
    } finally {
      deployInProgress = false;
    }
  };

  const changeNetwork = async () => {
    if (signed) {
      if (confirm("Changing network needs re-sign to create and deploy Tx. Proceed?")) {
        clearSign();
      } else {
        selectedNetwork = prevNetwork;
        return;
      }
    }

    prevNetwork = selectedNetwork;
  };

  const changePlanet = (e) => {
    if (signed) {
      if (confirm("Changing planet needs re-sign to create and deploy Tx. Proceed?")) {
        clearSign();
      } else {
        selectedPlanet = prevPlanet;
        return;
      }
    }

    prevPlanet = selectedPlanet;
    targetUrl = planets[selectedNetwork][selectedPlanet].url;
  };

  const clearSign = () => {
    privateKey = null;
    signed = false;
    signedTx = "";
    showSigned = false;
    deployInProgress = false;
  };
</script>

<Heading tag="h2" class="mb-4">Make new transaction to patch table csv</Heading>

<div class="grid grid-cols-2 gap-4">
  <div class="csv-part">
    <FilePond bind:this={pond} {name}
              allowmultiple=false instantupload=false
              oninit={handleInit}
              onaddfile={async(err, fileItem) => {
                    const csv = await handleAddFile(err, fileItem);
                    csvName = csv.name;
                    csvData = csv.data;
                  }}
              onremovefile={(err, fileItem) => {reset(); handleRemoveFile(err, fileItem);}}
    />
    <Table id="csv-table" striped={true}>
      <TableHead theadClass="text-xs">
        {#each thead as h}
          <TableHeadCell>{h}</TableHeadCell>
        {/each}
      </TableHead>
      <TableBody class="divide-y">
        {#each tbody as body}
          <TableBodyRow>
            {#each body as b}
              <TableBodyCell>{b}</TableBodyCell>
            {/each}
          </TableBodyRow>

        {/each}
      </TableBody>
    </Table>
    <table id="csv-table"></table>
  </div>
  <div class="sign-part">
    <div class="mb-6">
      <Label for="network">Select Network
        <Select id="network" class="mt-2" items={gqlNodeList} bind:value={selectedNetwork}
                on:change={changeNetwork}/>
      </Label>
      {#if ["mainnet", "preview", "internal"].includes(selectedNetwork)}
        <Label for="planet">Select Planet</Label>
        <Select id="planet" class="mt-2" bind:value={selectedPlanet} on:change={changePlanet}>
          {#each Object.entries(planets[selectedNetwork]) as [id, info]}
            <option value={id}>{info.name}</option>
          {/each}
        </Select>
      {/if}
    </div>
    <div class="mb-6">
      <Label for="private-key">PrivateKey</Label>
      <Input id="private-key" type="password" bind:value={privateKey}>
        <button slot="right" on:mousedown={() => {document.getElementById('private-key').type="text"}}
                on:mouseup={() => {document.getElementById("private-key").type = "password"}}>
          <EyeRegular/>
        </button>
      </Input>
      {#if !validPrivateKey}
        <Alert color="red">
          <CircleExclamationSolid size="18" class="inline"></CircleExclamationSolid>
          <span class="font-medium">Invalid PrivateKey!</span> Please check private key again!
        </Alert>
      {/if}
    </div>
    <!--        <div class="mb-6">-->
    <!--            <Datepicker datepickerFormat="yyyy-mm-dd" bind:value={validUntil}></Datepicker>-->
    <!--        </div>-->
    <div class="mb-6">
      <Alert color="yellow">If sign failed with valid data, please try again after clearing browser cache.</Alert>
      <Button on:click={sign} disabled={signInProgress}>
        {#if signInProgress}
          <Spinner class="mr-3" size="4"/>
          Signing...
        {:else}
          Sign
        {/if}
      </Button>
      {#if signed}
        {#if showSigned}
          <Button color="purple" on:click={() => {showSigned = false;}}>
            Hide Signed Tx data
          </Button>
        {:else}
          <Button color="purple" on:click={() => {showSigned = true;}}>
            Show Signed Tx data
          </Button>
        {/if}
        <Button color="red" on:click={clearSign}>Clear signed data</Button>
      {/if}
      {#if showSigned}
        <Textarea class="h-96" readonly id="signed-tx" bind:value={signedTx}/>
      {/if}
    </div>
    {#if signed}
      <div class="mb-6">
        The transaction will valid until {validUntil.plus({days: 1}).toFormat("yyyy-MM-dd HH:mm:ssZZ")}
      </div>
      <div class="mb-6 grid grid-flow-col gap-4">
        <Button color="green" on:click={download}>Download Signed Tx</Button>
        <Button color="red" disabled={deployInProgress} on:click={deploy}>
          {#if !deployInProgress}
            Deploy
          {:else}
            <Spinner class="mr-3" size="4"/>
            Deploying...
          {/if}
        </Button>
      </div>
    {/if}
    {#if txId}
      <div>Tx ID: <span id="tx_id">{txId || ""}</span></div>
    {/if}
  </div>
</div>
