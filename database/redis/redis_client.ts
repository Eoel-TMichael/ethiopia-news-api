import { createClient } from "redis";

interface IRedisOptions {
  port: number;
  host: string;
  password: string;
}

const redisClient = (options: IRedisOptions) =>
  new Promise((resolve, reject) => {
    const client = createClient(options);
    client.on("ready", () => {
      console.log("⭕ REDIS CONNECTED ⭕ ");
      resolve(client);
    });
    client.on("error", (error) => {
      console.log(`ERROR ${error}`);
      reject(error);
    });
  });

export default redisClient;
