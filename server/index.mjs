import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import dot from "dotenv";
import { chatgpt } from "./routes/chatgpt.mjs";
import { images } from "./routes/images.mjs";
import { chat } from "./routes/chat.mjs";
import { googleApi } from "./routes/googleApi.mjs";
dot.config();

async function main() {
  const port = Number(process.env.PORT) || 25577;
  if (!port || !Number.isInteger(port)) {
    console.error("bad port");
    process.exit(1);
  }

  const app = express();
  app.use(morgan("dev"));
  app.use(cors("*"));
  app.use(
    bodyParser.raw({
      type: "image/jpg",
      limit: "10mb",
    })
  );
  app.use((req, res, next) => {
    console.log(req.headers.authorization);
    next();
  });

  // OpenAI API
  app.use("/gpt", await chatgpt());

  // Google API
  //app.use("/google", await googleApi());

  // Chat
  app.use("/chats", await chat());

  // Images
  app.use("/image", images());

  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
}

main();
