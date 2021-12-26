import { Airgram, Auth, prompt, toObject, MessagesUnion } from "airgram";
import { telegramTikvahModel } from "../../../database/models/telegram_messages";
import dotenv from "dotenv";
import messageExtractor from "./message_extractor";

dotenv.config();

const API_ID = parseInt(process.env.API_KEY || "");
console.log(API_ID);

const airgram = new Airgram({
  apiId: Number.isInteger(API_ID) ? API_ID : 1000000,
  apiHash: process.env.API_HASH,
  command: process.env.TDLIB_COMMAND,
  databaseDirectory: "./db",
  logVerbosityLevel: 2,
});

airgram.use(
  new Auth({
    code: () => prompt("Please enter the secret code:\n"),
    phoneNumber: () => prompt("Please enter your phone number:\n"),
  })
);

// let lastmessage;

const run = async () => {
  toObject(
    await airgram.api.getChats({ chatList: { _: "chatListMain" }, limit: 1 })
  );
  /**
   * 
   * USE THIS CODE TO SAVE TIKVAH META MESSAGES TO MONGODB
   * ALSO UNCOMMENT lastvariable VARIABLE
   * 
   * ONCE I SAVED ALL THE MESSAGE HISTORY AS METADATA
   * CALLCHATHISTORY WILL NO LONGER BE USEFUL
   * 
   * */ 
  //const tikvah = toObject(
  //  await airgram.api.getChat({ chatId: -1001130580549 })
  //);
  //lastmessage = tikvah.lastMessage?.id;
  //callChatHistory(lastmessage!);
  const ret = await getChatMessages();
  return ret;
};

async function callChatHistory(lastmessage: number) {
  const history = toObject(
    await airgram.api.getChatHistory({
      chatId: -1001130580549,
      fromMessageId: lastmessage,
      offset: 0,
      limit: 10,
      onlyLocal: false,
    })
  );
  let tikvahMetaData;
  history.messages?.map(async (message) => {
    tikvahMetaData = new telegramTikvahModel(messageExtractor(message));
    try {
      await tikvahMetaData.save();
    } catch (e) {
      console.log("error" + e);
    }
  });
  // TODO make sure to re structure this before commiting
  lastmessage = history.messages![history.messages!.length - 1].id;
  callChatHistory(lastmessage);
}

async function getChatMessages() {
  const messageIds: number[] = [];
  const metaMessage = await telegramTikvahModel.find().sort({ messageId: -1 }).limit(10);
  metaMessage.forEach((message) => {
    messageIds.push(message.messageId);
  });
  return toObject(
    await airgram.api.getMessages({
      chatId: metaMessage[0].chatId,
      messageIds,
    })
  );
  }

export default run;
