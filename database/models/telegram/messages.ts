import { model, Schema } from "mongoose";

const telegramMessageSchema = new Schema({
  message_id: Number,
  date: Date,
  souce: Number,
  chatId: Number,
});

const telegramMessageModel = model("telegram-messages", telegramMessageSchema);

export default telegramMessageModel;
