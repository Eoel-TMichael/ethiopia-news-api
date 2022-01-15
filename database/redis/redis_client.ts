import { createClient } from "redis";

const redisClient = () => createClient();

export default redisClient;
