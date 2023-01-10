<svelte:head>
    <title>Nine Chronicles Table CSV Patcher</title>
</svelte:head>

<script>
  import FilePond from "svelte-filepond";

  let pond;
  let name = "filepond";

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
    console.log(`File ${fileItem.fileName} unloaded`);
    table.innerHTML = "";
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
        <div class="contents w-1/2">
            <table id="csv-table"></table>
        </div>
    </div>
    <div class="sign-part flex-1 w-1/2">
        sign here
    </div>
</div>
