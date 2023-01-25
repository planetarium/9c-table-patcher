<svelte:head>
    <title>Nine Chronicles Table CSV Patcher</title>
</svelte:head>

<script>
  import FilePond from "svelte-filepond";
  import {createAccount} from '@planetarium/account-raw';
  import {onMount} from "svelte";
  import {connectRpc} from "../utils/network.js";
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

  let pond;
  let name = "filepond";
  let showPrivateKey = false;
  $: type = showPrivateKey ? "text" : "password";

  let localnet = "";
  const internal = "http://9c-internal-rpc-1.nine-chronicles.com";
  const previewnet = "";
  let mainnet = "";
  let selectedNetwork;
  $: enableLocal = selectedNetwork === "local";
  const gqlNodeList = [
    {value: "local", name: "Local Network"},
    {value: "internal", name: "Internal Network"},
    {value: "previewnet", name: "Preview Network"},
    {value: "mainnet", name: "Mainnet"}
  ];
  $: gqlNodeMap = {
    local: localnet,
    internal: internal,
    previewnet: previewnet,
    mainnet: mainnet
  };

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
    mainnet = await connectRpc();
  });

  const sign = async () => {
    if (!(csvData && selectedNetwork && account)) {
      alert("Please check uploaded CSV and selected network");
      return;
    }
    const unsignedTx = await createActionTx(account, csvName, csvData, validUntil, gqlNodeMap[selectedNetwork]);
    if (!unsignedTx) {
      return;
    }
    signed = true;
    signedTx = await signTransaction(unsignedTx, account);
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
    const result = confirm(`Deploy this csv data to ${selectedNetwork}?`);
    if (!result) {
      return;
    }
    try {
      deployInProgress = true;
      const txId = await stageTransaction(signedTx, gqlNodeMap[selectedNetwork]);
      if (!txId) {
        return;
      }
      const txResult = await waitForMining(txId, gqlNodeMap[selectedNetwork]);
      if (txResult.errors) {
        alert(`Mining monitor failed: ${txResult.errors[0].message}`);
        return;
      }
      if (txResult.txStatus === "SUCCESS") {
        alert(`Tx added to block: ${txResult.blockIndex}`);
        reset();
      } else {
        alert(`Tx add failed: ${txResult.txStatus}`);
      }
    } finally {
      deployInProgress = false;
    }
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
                <Select id="network" class="mt-2" items={gqlNodeList} bind:value={selectedNetwork}/>
            </Label>
            {#if enableLocal}
                <Input label="Local Network" id="local-network" bind:value={localnet}
                       placeholder="Input local network address including `http(s)://`"/>
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
            <Button on:click={sign}>Sign</Button>
            {#if signed}
                <Button color="purple" on:click={() => {showSigned = !showSigned;}}>
                    Show Signed Tx data
                </Button>
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
    </div>
</div>
