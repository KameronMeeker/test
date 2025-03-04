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
  console.log("PORT:", port); // Debugging line

  if (!port || !Number.isInteger(port) || port <= 0 || port > 65535) {
    console.error("Invalid port:", port);
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

  app.use("/gpt", await chatgpt());
  app.use("/chats", await chat());
  app.use("/image", images());

  // ✅ Ensure binding to 0.0.0.0
  app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server listening on port ${port}`);
  });
}

main();
