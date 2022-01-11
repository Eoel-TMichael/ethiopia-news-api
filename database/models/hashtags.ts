import { model, Schema } from "mongoose";

const hashtagSchema = new Schema({
  hashtag: String,
});

const hashtagModel = model("Hashtags", hashtagSchema);

export { hashtagSchema, hashtagModel };
