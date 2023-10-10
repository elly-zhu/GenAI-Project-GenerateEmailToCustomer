import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import dotenv from "dotenv";
import OpenAI from "openai";
import {
  form_user_content,
  form_assistant_content_about_product,
  form_assistant_content_about_response_language,
  form_system_to_write_email_subject,
  system_as_assistant_content,
} from "./messages_helper.js";
import * as products_db from "./products_db.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

const port = 8080;
const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "static")));

server.listen(port, () => {
  console.log(`Node app listening on port ${port}!`);
});

async function runChatCompletion({
  messages,
  model = "gpt-3.5-turbo",
  temperature = 0,
  max_tokens = 2000,
}) {
  //   console.log("messages:");
  //   console.log(JSON.stringify(messages));
  console.log("running runChatCompletion..");

  try {
    // console.log({ messages });
    const chatCompletion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      max_tokens,
    });

    console.log("finished runChatCompletion..");
    return chatCompletion.choices[0].message["content"];
  } catch (error) {
    console.error("Error in runChatCompletion:", error);
    throw error; // Re-throw the error to handle it at a higher level if needed
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const {
  default: { products },
} = products_db;

app.get("/db", (req, res) => {
  res.sendFile(__dirname + "/products_db.json");
});

app.post("/answer_questions", async (req, res) => {
  const question = req.body.question;
  const language = req.body.language;

  let userContent = form_user_content(question);
  let assistantProductContent = form_assistant_content_about_product(
    products,
    question
  );
  let assistantLanguageContent =
    form_assistant_content_about_response_language(language);
  console.log(`User question: ${question} (answer in ${language})`);

  try {
    const answer_response = await runChatCompletion({
      messages: [
        { role: "system", content: system_as_assistant_content },
        { role: "user", content: userContent },
        { role: "assistant", content: assistantProductContent },
        { role: "assistant", content: assistantLanguageContent },
      ],
    });
    console.log("Response from runChatCompletion..");
    console.log(answer_response);
    res.send({ data: answer_response });
  } catch (err) {
    console.log(err);
    res.send(new Error(err));
  }
});

app.post("/write_emails", async (req, res) => {
  const comment = req.body.comment;
  const language = req.body.language;

  let userContent = form_user_content(comment);
  let assistantProductContent = form_assistant_content_about_product(
    products,
    comment
  );
  let assistantLanguageContent =
    form_assistant_content_about_response_language(language);
  console.log(`User comment: ${comment} (answer in ${language})`);
  try {
    const email_response = await runChatCompletion({
      messages: [
        {
          role: "system",
          content: form_system_to_write_email_subject(language),
        },
        { role: "user", content: userContent },
        { role: "assistant", content: assistantProductContent },
        { role: "assistant", content: assistantLanguageContent },
      ],
    });

    console.log("Response from runChatCompletion..");
    console.log(email_response);
    res.send({ data: email_response });
  } catch (err) {
    console.log(err);
    return { err };
  }
});
