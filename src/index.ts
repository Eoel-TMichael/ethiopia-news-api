import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import parser from "body-parser";
import run, { getChatMessages } from "./utils/airgram/airgram";
import { createClient } from 'redis';


dotenv.config();
const client = createClient();

const app = express();

(async () => {
  
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();

  // await client.set('key', 'value');
  // const value = await client.get('key');
})();

const EXPIRATION_DATE = 120;

app.use(cors());
app.use(express.urlencoded({extended: true}))
app.use(parser.json());

mongoose.connect(process.env.MONGODB_URL!, (error) => {
  if (error) console.log(`ERROR\n=== === ===\n${error}`);
  console.log("💮 connected to database");
});

app.get("/", (req, res) => {
  res.json({ Hello: "HELLO" });
});

app.get("/redis", async (req, res) => {
  try {
    await client.set("age", 20);
    res.status(200).send(await client.get("age"));
  } catch (e) {
    console.log(e);
  }
})

app.get("/:source/:date", async (req, res) => {
  // console.log(new Date(req.body.date).toISOString());
  const {source , date} = req.params;
  console.log("🌹");
  try {
    await run();
    const redisData = await client.get("timeMessage");
    if (redisData !== null) {
      res.status(200).json({body: redisData});
    } else {
      const data = await getChatMessages(source, new Date(date));

      await client.set('timeMessage', JSON.stringify(data), {
        EX: EXPIRATION_DATE,
        NX: true
      });
      res.status(200).json({body: data});
    }
    
  } catch (e) {
    res.status(500).send("SOMETHING WENT WRONG IN THE INTERNAL SERVER");
    console.log(e);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`server started at http://localhost:${PORT}`)
);
