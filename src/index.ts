import express, { Request, Response } from "express";
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
    res.json({ Hello: "Hello" });
  } catch (e) {
    res.json({ error: e });
  }
});

app.get("/source/:name", async (req, res, next) => {
  const source = req.params.name;
  try {
    const newsSource = await run(source);
    res.json({"news source": "DONE"});
  } catch (e) {
    res.json({error: `ERROR: ${e}`});
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);