<svelte:head>
 <title>Nine Chronicles Table CSV Patcher</title>
</svelte:head>

<script>
import FilePond, {supported} from "svelte-filepond";

let pond;
let name = "filepond";

const handleInit = () => {
  console.log("Filepond initialized");
};

const handleAddFile = async (err, fileItem) => {
  console.log(fileItem.file);
  const reader = new FileReader();
  reader.onload = () => {
    console.log(reader.result);
    const data = reader.result.split("\n");
    console.log(data);
  }
  await reader.readAsText(fileItem.file);
  const table =   document.getElementById("csv-table");
  table.innerHTML = "";
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);
  thead.insertRow();


  console.log(`File added: ${fileItem.file.name}`);
};
</script>

<h1>
    Make new transaction to patch table csv
</h1>

<div class="app">
    <FilePond bind:this={pond} {name}
              allowmultiple=false instantupload=false
    oninit={handleInit} onaddfile={handleAddFile}/>
</div>
<div class="contents">
    <table id="csv-table"></table>
</div>