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
      "name": "Internal Network",
      "planets": {
        "0x100000000000": {
          "name": "Odin (Internal)",
          "url": "https://odin-internal-rpc-1.nine-chronicles.com/graphql"
        },
        "0x100000000001": {
          "name": "Heimdall (Internal)",
          "url": "https://heimdall-internal-rpc.nine-chronicles.com/graphql"
        },
        "0x100000000002": {
          "name": "Idun (Internal)",
          "url": "https://idun-internal-rpc-1.nine-chronicles.com/graphql"
        },
        "0x100000000003": {
          "name": "Thor (Internal)",
          "url": "https://thor-internal-rpc-1.nine-chronicles.com/graphql"
        }
      },
    },
    "preview": {
      "name": "Preview Network",
      "planets": {
        "0x100000000000": {
          "name": "Odin (Preview)",
          "url": "https://odin-preview-validator-5.nine-chronicles.com/graphql"
        },
        "0x100000000001": {
          "name": "Heimdall (Preview)",
          "url": "https://heimdall-preview-validator-1.nine-chronicles.com/graphql"
        },
        "0x100000000003": {
          "name": "Thor (Preview)",
          "url": "https://thor-preview-validator-1.nine-chronicles.com/graphql"
        }
      },
    },
    "9c-dev-v2": {
      "name": "9c Dev V2",
      "planets": {
        "0x100000000000": {
          "name": "Odin (Dev V2)",
          "url": "http://k8s-9codinli-validato-aeaeca2683-8e145acafdea8c00.elb.us-east-2.amazonaws.com/graphql"
        }
      },
    },
    "mainnet": {
      "name": "Mainnet",
      "planets": {
        "0x000000000000": {
          "name": "Odin",
          "url": "https://odin-full-state.nine-chronicles.com/graphql"
        },
        "0x000000000001": {
          "name": "Heimdall",
          "url": "https://heimdall-full-state.nine-chronicles.com/graphql"
        },
        "0x000000000003": {
          "name": "Thor",
          "url": "https://thor-full-state.nine-chronicles.com/graphql"
        },
      }
    },
  };

  let prevPlanet;
  let selectedPlanet;

  let prevNetwork;
  let selectedNetwork;
  let targetUrl = "";

  let privateKey = "";
  let account;
  let validPrivateKey;
  let selectedPlanets = []; // Change to an array
  let txIds = {};

  const addPlanet = () => {
    if (selectedPlanet && !selectedPlanets.includes(selectedPlanet)) {
      selectedPlanets = [...selectedPlanets, selectedPlanet];
    }
  };

  const removePlanet = () => {
    selectedPlanets = selectedPlanets.filter(planet => planet !== selectedPlanet);
  };

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

  let signedTx = {};  // Change to an object to store signed transactions per planet

  let signed = false;
  let showSigned = false;
  let signInProgress = false;
  let deployInProgress = false;

  const reset = () => {
    csvName = null;
    csvData = null;
    signed = false;
    showSigned = false;
    signedTx = {};
    pond.removeFiles();
  }

  onMount(async () => {
  });

  const sign = async () => {
    if (!(csvData && selectedNetwork && account)) {
      alert("Please check uploaded CSV and selected network");
      return;
    }
    if (selectedPlanets.length === 0) {
      alert("Please select at least one planet.");
      return;
    }
    signInProgress = true;
    // reset previous txIds
    txIds = {};
    for (const planetId of selectedPlanets) {
      const planetUrl = planets[selectedNetwork].planets[planetId].url;
      const unsignedTx = await createActionTx(account, csvName, csvData, validUntil, planetUrl);
      if (!unsignedTx) {
        continue;
      }
      signedTx[planetId] = await signTransaction(unsignedTx, account);
    }

    signed = true;
    signInProgress = false;
  };

  const download = (planetId) => {
    const txBlob = new Blob([signedTx[planetId]], {type: "text/plain"});
    const downloadUrl = window.URL.createObjectURL(txBlob);
    const downloadLink = document.createElement("a");
    downloadLink.download =
            `signedTx_${csvName}_create_${DateTime.utc().toISO()}_until_${validUntil.toFormat("yyyy-MM-dd")}_${planetId}`;
    downloadLink.href = downloadUrl;
    downloadLink.click();
  };

   const deploy = async () => {
     if (!signed) {
       alert("Please sign the transactions before deploying.");
       return;
     }

     const result = confirm(`Deploy signed transactions to all selected planets in ${selectedNetwork}?`);
     if (!result) {
       return;
     }

     let msg = "";
     for (const planetId of selectedPlanets) {
       const planetUrl = planets[selectedNetwork].planets[planetId].url;
       try {
         deployInProgress = true;
         let txId = await stageTransaction(signedTx[planetId], planetUrl);
         if (!txId) {
           continue;
         }
         txIds[planetId] = txId;

         const txResult = await waitForMining(txId, planetUrl);
         if (txResult.errors) {
           msg += `${txId}: Mining monitor failed on ${planets[selectedNetwork].planets[planetId].name}: ${txResult.errors[0].message}\n`;
           continue;
         }
         if (txResult.txStatus === "SUCCESS") {
           msg += `${txId}: Tx added to block on ${planets[selectedNetwork].planets[planetId].name}: ${txResult.blockIndex}\n`;
         } else {
           msg += `${txId}: Tx add failed on ${planets[selectedNetwork].planets[planetId].name}: ${txResult.txStatus}::${txResult.exceptionNames[0]}}\n`;
         }
       } finally {
         deployInProgress = false;
       }
     }
     alert(msg);
     reset();
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
    targetUrl = planets[selectedNetwork].planets[selectedPlanet].url;
  };

  const clearSign = () => {
    signed = false;
    signedTx = {};
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
        <Select id="network" class="mt-2" bind:value={selectedNetwork} on:change={changeNetwork}>
          {#each Object.entries(planets) as [planet, data]}
            <option value={planet}>{data.name}</option>
            {/each}
        </Select>
      </Label>
      {#if Object.keys(planets).includes(selectedNetwork)}
        <!-- Update the UI -->
        <div class="mb-6">
          <Label for="planet">Select Planet</Label>
          <Select id="planet" class="mt-2" bind:value={selectedPlanet} on:change={changePlanet}>
            {#each Object.entries(planets[selectedNetwork].planets) as [id, info]}
              <option value={id}>{info.name}</option>
            {/each}
          </Select>
          <Button on:click={addPlanet}>+</Button>
          <Button on:click={removePlanet}>-</Button>
        </div>

        <!-- Display selected planets -->
        <div>
          <h3>Selected Planets:</h3>
          <ul>
            {#each selectedPlanets as planetId}
              <li>{planets[selectedNetwork].planets[planetId].name}</li>
            {/each}
          </ul>
        </div>
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
        {#each selectedPlanets as planetId}
          <div class="mb-4">
            <h4>Signed Tx for {planets[selectedNetwork].planets[planetId].name}:</h4>
            <Textarea class="h-48" readonly bind:value={signedTx[planetId]}/>
          </div>
        {/each}
      {/if}
    </div>
    {#if signed}
      <div class="mb-6">
        The transaction will valid until {validUntil.plus({days: 1}).toFormat("yyyy-MM-dd HH:mm:ssZZ")}
      </div>
      <div class="mb-6 grid grid-flow-col gap-4">
        {#each selectedPlanets as planetId}
          <Button color="green" on:click={() => download({planetId})}>Download Signed Tx for {planets[selectedNetwork].planets[planetId].name}</Button>
        {/each}
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
    <!-- Display txId for each planet after deployment -->
    {#if Object.keys(txIds).length > 0}
      <div class="mb-6">
        <h3>Transaction IDs:</h3>
        <ul>
          {#each Object.entries(txIds) as [planetId, txId]}
            <li>{planets[selectedNetwork].planets[planetId].name}: {txId}</li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</div>
