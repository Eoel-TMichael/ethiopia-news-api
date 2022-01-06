import { model, Schema } from "mongoose";

const telegramSchema = new Schema({
  chatName: String,
  chatId: Number,
  date: String,
  messageId: Number,
  hashtag: [String],
});

const telegramModel = model("Telegram_Messeges", telegramSchema);

export { telegramSchema, telegramModel };
