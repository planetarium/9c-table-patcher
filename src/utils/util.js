export const sleep = (n) => {
  return new Promise((r) => setTimeout(r, n * 1000));
};

export const parseCsv = (origin) => {
  const data = [];
  if (!origin) {
    return data;
  }
  const sanitized = origin.trim().replaceAll("\r", "");
  const rows = sanitized.split("\n");
  for (let row of rows) {
    if (row !== "") {
      data.push(row.split(","));
    }
  }
  return data;
};
