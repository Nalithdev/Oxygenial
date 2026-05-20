import { listConversations } from './queries/list-conversations';
import { listMessages } from './queries/list-messages';
import { sendMessage } from './mutations/send-message';

export const conversationRouter = {
  list: listConversations,
  listMessages,
  sendMessage,
};
