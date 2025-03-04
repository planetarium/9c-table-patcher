import jwt from "jsonwebtoken";
import AWS from 'aws-sdk';

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

export const getJWT = (secret) => {
  return jwt.sign({"iss": "9c-table-patcher", "exp": Math.floor(Date.now() / 1000) + 60}, secret);
};

export const uploadCsvToR2 = async (bucketName, key, fileContent, accessKeyId, secretAccessKey) => {
  try {
    const r2 = new AWS.S3({
      endpoint: "https://1cd1f38b21c0bfdde9501f7d8e43b663.r2.cloudflarestorage.com",
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    });

    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'text/csv',
    };

    await r2.upload(params).promise();
    return `File uploaded successfully at ${key}`;
  } catch (error) {
    return `Error uploading file ${error}`;
  }
};