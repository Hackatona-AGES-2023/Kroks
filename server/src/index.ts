import fastify from "fastify";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { computerVision } from "./image";
require("dotenv").config();

const server = fastify();
server.post("/image", async (req, res) => {
  const body = req.body as string[];
  const promises = [];
  for (const url of body) {
    promises.push(computerVision(url));
  }
  return Promise.all(promises);
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

server.post("/test", async (req, res) => {
  const messages: ChatCompletionRequestMessage[] = [];

  messages.push({
    role: "system",
    content: "Você é um assistente virtual de acessibilidade.",
  });

  for (const reqElement of req.body as string[]) {
    messages.push({
      role: "user",
      content: `Você pode adicionar roles e aria para tornar esse html mais acessível: ${req}`,
    });
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    if (completion.data.choices[0].message) {
      messages.push(completion.data.choices[0].message);
    }
  }

  return messages.filter((m) => m.role == "assistant").map((n) => n.content);
});

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
