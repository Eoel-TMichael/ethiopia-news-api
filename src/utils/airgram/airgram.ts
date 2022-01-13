import { Airgram, Auth, prompt, toObject, MessagesUnion } from "airgram";
import telegramMessageModel from "../../../database/models/telegram/messages";
import dotenv from "dotenv";

dotenv.config();

interface MetaMessage {
  message_id: number;
  data: Date;
  souce: string;
}

const API_ID = parseInt(process.env.API_KEY || "");

const DEFAULT_EXPIRATION = 1800;

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

let lastmessage;

const run = async (source: string) => {
  const chats = toObject(
    await airgram.api.getChats({ chatList: { _: "chatListMain" }, limit: 1 })
  );
  /**
   *
   * USE THIS CODE BELOW TO SAVE CHANNEL'S META MESSAGES TO MONGODB
   * ALSO UNCOMMENT lastvariable VARIABLE
   *
   * ONCE I SAVED ALL THE MESSAGE HISTORY AS METADATA
   * CALLCHATHISTORY WILL NO LONGER BE USEFUL
   *
   */

  let sourceObject;
  let chatId;

  switch (source) {
    case "tikvah":
      chatId = -1001130580549;
      sourceObject = toObject(await airgram.api.getChat({ chatId }));
      lastmessage = sourceObject.lastMessage?.id;
      // callChatHistory(lastmessage!, source, chatId);
      break;
    case "ebs-news":
      chatId = -1001185190358;

      sourceObject = toObject(await airgram.api.getChat({ chatId }));
      lastmessage = sourceObject.lastMessage?.id;
      // callChatHistory(lastmessage!, source, chatId);
      break;
    // USE KANA-TV'S CHAT-ID
    // case 'kana-tv':
    //   console.log('run the function(kana-tvChatId)');
    //   sourceObject = toObject(
    //     await airgram.api.getChat({ chatId: -1001130580549 })
    //   );
    //   lastmessage = sourceObject.lastMessage?.id;
    //   callChatHistory(lastmessage!, source, -1001130580549);
    //   break;
    default:
      chatId = 0;
      console.log("Chat is not There yet");
  }
  // based on the source name fetch the last few messages from mongoDB
  // all the meta messages should be in the same collection
  // const data = await telegramModel.find()
  // const ret = await getChatMessages();
  // return ret;
  await getChatMessages(chatId);
};

let savedMetaMessage;

// async function callChatHistory(lastmessage: number, source: string, chatId: number) {
//   const history = toObject(
//     await airgram.api.getChatHistory({
//       chatId: chatId,
//       fromMessageId: lastmessage,
//       offset: 0,
//       limit: 10,
//       onlyLocal: false,
//     })
//   );
//   let sourceMetaData;
//   history.messages?.map(async (message) => {
//     console.log(message.content._);
//     sourceMetaData = new telegramMessageModel({message_id: message.id, date: message.date, source: source});
//     setInterval(() => {}, 2000)
//     try {
//       savedMetaMessage = await sourceMetaData.save((err: Error) => {
//         if (err) console.log('ERROR'+ err);
//       });
//     } catch (e) {
//       console.log("error" + e);
//     }
//   });
//   // TODO make sure to re structure this before commiting
//   lastmessage = history.messages![history.messages!.length - 1].id;
//   callChatHistory(lastmessage, source, chatId);
// }
//  1970-01-20T00:06:32.062+00:00
async function getChatMessages(chatId: number) {
  const metaMessage = await telegramMessageModel.find({
    date: "1970-01-20T00:06:32.062+00:00",
  });

  const metaMessagesIds: number[] = [];

  if (metaMessage !== null) {
    metaMessage?.forEach((element) => {
      metaMessagesIds.push(element?.message_id);
    });
    console.log("Got Here");
    const messages = toObject(
      await airgram.api.getMessages({
        chatId,
        messageIds: metaMessagesIds,
      })
    );
    console.log(messages.totalCount);
    messages.messages?.forEach((message) => {
      console.log(message.content._);
    });
  }
}

export default run;
