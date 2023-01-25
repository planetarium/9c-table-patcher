export const handleInit = () => {
  console.log("Filepond initialized");
};

export const handleAddFile = (err, fileItem) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => {
      resolve({name: fileItem.file.name.split(".")[0], data: reader.result.trim()});
    };
    reader.onerror = reject;
    reader.readAsText(fileItem.file);
  });
};

export const handleRemoveFile = (err, fileItem) => {
  console.log(`File ${fileItem.file.name} unloaded`);
};
