import fastify from "fastify";
import cors from "@fastify/cors";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { json } from "stream/consumers";
require("dotenv").config();
const server = fastify();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
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
      "Você é um assistente virtual de acessibilidade. Você pode adicionar roles e aria para tornar os htmls enviados mais acessível só retorne código",
  });

  let count = 0;

  for (const reqElement of req.body as string[]) {
    messages.push({
      role: "user",
      content: `${reqElement}`,
    });
    console.log(count++);
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
