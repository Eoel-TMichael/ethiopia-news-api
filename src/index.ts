import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import run from "./utils/airgram/airgram";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URL!, (error) => {
  if (error) console.log(`ERROR\n=== === ===\n${error}`);
  console.log("💮 connected to database 💮");
});

app.get("/", async (req, res) => {
  try {
    const telegramTikvahMessages = await run();
    res.json({ Hello: telegramTikvahMessages });
  } catch(e) {
    res.json({error: e})
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
