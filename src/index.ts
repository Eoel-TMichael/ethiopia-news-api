import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import run from "./utils/airgram/airgram";
// import redisClient from "../database/redis/redis_client";

dotenv.config();

run("tikvah");

const app = express();

mongoose.connect(process.env.MONGODB_URL!, (error) => {
  if (error) console.log(`ERROR\n=== === ===\n${error}`);
  console.log("💮 connected to database");
});

app.get("/", (req, res) => {
  res.json({ Hello: "HELLO" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
