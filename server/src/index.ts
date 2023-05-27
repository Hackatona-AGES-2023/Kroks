import fastify from "fastify";
import cors from "@fastify/cors";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
require("dotenv").config();

const server = fastify();

const key = process.env.VISION_KEY;
const endpoint = process.env.VISION_ENDPOINT;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

server.post("/image", async (req, res) => {
  const body = req.body as string[];
  const promises = [];

  console.log(key);
  console.log(endpoint);

  for (const url of body) {
    promises.push(
      fetch(
        endpoint +
          "/vision/v3.2/analyze?visualFeatures=Description&language=pt",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": key ?? "",
          },
          body: JSON.stringify({
            url,
          }),
        }
      )
    );
  }
  const responses = await Promise.all(promises);
  const jsons = await Promise.all(responses.map((r) => r.json()));

  return jsons.map((j) => j.description.captions[0].text);
});

server.register(cors, {
  // put your options here
});

const openai = new OpenAIApi(configuration);

server.post("/test", async (req, res) => {

  const messages: ChatCompletionRequestMessage[] = [];

  messages.push({
    role: "system",
    content:
      "Você é um assistente virtual de acessibilidade, você adiciona arias e roles, para tornar os htmls enviados mais acessíveis, e trocar tags se necessário, só retorne código, nenhum texto explicando o que foi feito",
  });

  for (const reqElement of req.body as string[]) {
    messages.push({
      role: "user",
      content: `${reqElement}`,
    });
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    if (completion.data.choices[0].message) {
      messages.push(completion.data.choices[0].message);
    }
  }

  return { content: messages.filter((m) => m.role == "assistant").pop()?.content };
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
