import jwt from "jsonwebtoken";
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";

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
    const r2 = new S3Client({
      endpoint: "https://1cd1f38b21c0bfdde9501f7d8e43b663.r2.cloudflarestorage.com",
      region: "us-east-1",
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      }
    });

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: 'text/csv',
    });

    await r2.send(command);
    return `File uploaded successfully at ${key}`;
  } catch (error) {
    return `Error uploading file ${error}`;
  }
};

export const requestCachePurge = async (lambdaEndpoint, cloudflareEmail, cloudflareApiKey, key) => {
  try {
    const response = await fetch(lambdaEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cloudflareEmail,
        cloudflareApiKey,
        key
      })
    });

    const result = await response.json();
    return result.message;
  } catch (error) {
    return `Error requesting cache purge: ${error.message}`;
  }
};
