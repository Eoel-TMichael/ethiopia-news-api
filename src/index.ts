import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import parser from "body-parser";
import run, { getChatMessages } from "./utils/airgram/airgram";
// import redisClient from "../database/redis/redis_client";

dotenv.config();

const app = express();

app.use(cors());
app.use(parser.json());

mongoose.connect(process.env.MONGODB_URL!, (error) => {
  if (error) console.log(`ERROR\n=== === ===\n${error}`);
  console.log("💮 connected to database");
});

app.get("/", (req, res) => {
  res.json({ Hello: "HELLO" });
});

app.get("/:source/:date", async (req, res) => {
  // console.log(new Date(req.body.date).toISOString());
  const {source , date} = req.params;
  console.log("🌹");
  try {
    await run();
    const data = await getChatMessages(source, new Date(date));
    // console.log(data);
    res.status(200).json({body: data});
  } catch (e) {
    res.status(500).send("SOMETHING WENT WRONG IN THE INTERNAL SERVER");
    console.log(e);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
