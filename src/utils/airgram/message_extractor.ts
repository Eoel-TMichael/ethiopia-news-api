import { MessageUnion } from "airgram";

const hashExtractor = (message: string) => {
  const regex = /(#(?:[^\x00-\x7F]|\w)+)/g;
  return message.match(regex);
};

const messageExtractor = (message: MessageUnion) => {
  let hashtag;

  switch (message.content._) {
    case "messagePhoto":
      hashtag = hashExtractor(message.content.caption.text);
      break;
    case "messageVideo":
      hashtag = hashExtractor(message.content.caption.text);
      break;
    case "messageText":
      hashExtractor(message.content.text.text);
      break;
    default:
      console.log("got a type this\n--- --- ---" + message.content._+"Will handle this type sometime soon");
      break;
  }

  const filteredMessage = {
    chatId: message.chatId,
    date: message.date,
    messageId: message.id,
    hashtag,
  };

  return filteredMessage;
};

export { hashExtractor };
export default messageExtractor;
