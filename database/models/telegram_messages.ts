import { model, Schema } from "mongoose";

const telegramSchema = new Schema({
  chatId: Number,
  date: String,
  messageId: Number,
  hashtag: [String],
});

const telegramTikvahModel = model("Telegram_Messeges", telegramSchema);

export { telegramSchema, telegramTikvahModel };
