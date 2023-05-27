const async = require("async");
const fs = require("fs");
const https = require("https");
const path = require("path");
const createReadStream = require("fs").createReadStream;
const sleep = require("util").promisify(setTimeout);
const ComputerVisionClient =
  require("@azure/cognitiveservices-computervision").ComputerVisionClient;
const ApiKeyCredentials = require("@azure/ms-rest-js").ApiKeyCredentials;
require("dotenv").config();

const key = process.env.VISION_KEY;
const endpoint = process.env.VISION_ENDPOINT;

export const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { "Ocp-Apim-Subscription-Key": key } }),
  endpoint
);

export async function computerVision(url: string) {
  const printedResult = await readTextFromURL(computerVisionClient, url);
  return printRecText(printedResult);
}

async function readTextFromURL(client: any, url: string) {
  console.log("sono");
  let result = await client.read(url);

  console.log("sono");

  let operation = result.operationLocation.split("/").slice(-1)[0];
  console.log("sono");
  while (result.status !== "succeeded") {
    await sleep(1000);
    result = await client.getReadResult(operation);
  }
  return result.analyzeResult.readResults;
}
function printRecText(readResults: any) {
  console.log("Recognized text:");
  for (const page in readResults) {
    if (readResults.length > 1) {
      console.log(`==== Page: ${page}`);
    }
    console.log("sono");
    const result = readResults[page];
    if (result.lines.length) {
      for (const line of result.lines) {
        console.log(line.words.map((w: any) => w.text).join(" "));
      }
      console.log("sono");
    } else {
      console.log("No recognized text.");
    }
  }
}
