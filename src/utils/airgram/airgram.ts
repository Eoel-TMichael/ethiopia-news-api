import { Airgram, Auth, prompt, toObject } from "airgram";
import dotenv from "dotenv";

dotenv.config();

const API_ID = parseInt(process.env.API_KEY || "");
console.log(API_ID);

const airgram = new Airgram({
  apiId: Number.isInteger(API_ID) ? API_ID : 1000000,
  apiHash: process.env.API_HASH,
  //  command: process.env.TDLIB_COMMAND,
  //   databaseDirectory: "../../db",
  logVerbosityLevel: 2,
});

airgram.use(
  new Auth({
    code: () => prompt("Please enter the secret code:\n"),
    phoneNumber: () => prompt("Please enter your phone number:\n"),
  })
);

let lastmessage;
let wholelastmessage;

const run = async () => {
  toObject(
    await airgram.api.getChats({ chatList: { _: "chatListMain" }, limit: 1 })
  );
  const tikvah = toObject(
    await airgram.api.getChat({ chatId: -1001130580549 })
  );
  lastmessage = tikvah.lastMessage?.id;
  callChatHistory(lastmessage!);
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
  history.messages?.map((message) => {
    switch (message.content._) {
      case "messageText":
        console.log(message.content.text.text);
        break;
      case "messagePhoto":
        console.log(message.content.caption.text);
        break;
      case "messageDocument":
        console.log(message.content.document.fileName);
        break;
      case "messagePinMessage":
        console.log("Pinned Message" + message.content.messageId);
        break;
      default:
        console.log("will do it some time soon, jumped for now.");
    }
  });
  wholelastmessage = history.messages![history.messages!.length - 1];
  lastmessage = wholelastmessage.id;
  await callChatHistory(lastmessage);
}

export default run;
