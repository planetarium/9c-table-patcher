<svelte:head>
    <title>Nine Chronicles Table CSV Patcher</title>
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</svelte:head>

<script>
  import FilePond from "svelte-filepond";
  import {createAccount} from '@planetarium/account-raw';
  import {decipherV3} from "@planetarium/account-web";
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

  let pondCsv;
  let pondCsvName = "filepond_csv";
  let pondKeystore;
  let pondKeystoreName = "filepond_keystore";
  let showPrivateKey = false;
  $: type = showPrivateKey ? "text" : "password";

  let localnet = "";
  // const internal = "http://9c-internal-rpc-1.nine-chronicles.com";
  const internal = "https://d1q7bftovae5zr.cloudfront.net";
  const previewnet = "https://d1j87dd84yjyat.cloudfront.net";
  let mainnet = "https://d233civhnximna.cloudfront.net";
  let prevNetwork;
  let selectedNetwork;
  let prevKeyType;
  let selectedKeyType;
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
  const keyTypeList = [
    {value: "keystore", name: "Use Keystore file"},
    {value: "private_key", name: "Provide private key directly"}
  ]

  let privateKey = "";
  let account;
  let validPrivateKey;
  $: {
    try {
      account = createAccount(privateKey);
      validPrivateKey = true;
    } catch (e) {
      console.log(e);
      validPrivateKey = false;
    }
  }

  let csvName = null;
  let csvData = null;
  let keystore = null;
  let passphrase = null;
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
    pondCsv.removeFiles();
  }

  // onMount(async () => {
  //   mainnet = await connectRpc();
  // });

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
        alert(`Tx add failed: ${txResult.txStatus}::${txResult.exceptionName}}`);
      }
    } finally {
      deployInProgress = false;
    }
  };

  const changeNetwork = () => {
    if (signed) {
      if (confirm("Changing network needs re-sign to create and deploy Tx. Proceed?")) {
        clearSign();
        prevNetwork = selectedNetwork;
      } else {
        selectedNetwork = prevNetwork;
      }
    } else {
      prevNetwork = selectedNetwork;
    }
  };

  const changeKeyType = () => {
    if (signed) {
      if (confirm("Changing key type needs re-sign to create and deploy Tx. Proceed?")) {
        clearSign();
        prevKeyType = selectedKeyType;
      } else {
        selectedKeyType = prevKeyType;
      }
    } else {
      prevKeyType = selectedKeyType;
    }
  }

  const unlockKeystore = () => {
    console.log(pondKeystore);
    console.log(keystore);
    privateKey = decipherV3(keystore.data, passphrase).getPrivateKey();
    console.log(privateKey);
  }

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
        <FilePond bind:this={pondCsv} name={pondCsvName}
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
            {#if selectedNetwork === "local"}
                <Input label="Local Network" id="local-network" bind:value={localnet}
                       placeholder="Input local network address including `http(s)://`"/>
            {/if}
        </div>
        <div class="mb-6">
            <Label for="key-type">Select Key Type
                <Select id="key-type" class="mt-2" items={keyTypeList} on:change={changeKeyType}
                        bind:value={selectedKeyType}/>
            </Label>
            {#if selectedKeyType === "keystore"}
                <FilePond bind:this={pondKeystore} name={pondKeystoreName}
                          allowmultiple=false instantupload=false
                          oninit={handleInit}
                          onaddfile={async(err, fileItem) => {
                    keystore = await handleAddFile(err, fileItem);
                    console.log(keystore);
                  }}
                          onremovefile={(err, fileItem) => {reset(); handleRemoveFile(err, fileItem);}}
                />
                <Label for="passphrase">Passphrase
                    <Input id="passphrase" type="password" bind:value={passphrase}>
                        <button slot="right" on:mousedown={() => {document.getElementById("passphrase").type="text"}}
                                on:mouseup={() => {document.getElementById("passphrase").type="password"}}>
                            <EyeRegular/>
                        </button>
                    </Input>
                </Label>
                {#if validPrivateKey}
                    <Button color="green" disabled>Unlocked!</Button>
                {:else }
                    <Button on:click={unlockKeystore}>Unlock</Button>
                {/if}
            {:else if selectedKeyType === "private_key"}
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
            {/if}
        </div>
        <!--        <div class="mb-6">-->
        <!--            <Datepicker datepickerFormat="yyyy-mm-dd" bind:value={validUntil}></Datepicker>-->
        <!--        </div>-->
        <div class="mb-6">
            <Alert color="yellow">If sign failed with valid data, please try again after clearing browser cache.</Alert>
            <Button on:click={sign}>Sign</Button>
            {#if signed}
                <Button color="purple" on:click={() => {showSigned = !showSigned;}}>
                    Show Signed Tx data
                </Button>
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
    </div>
</div>
