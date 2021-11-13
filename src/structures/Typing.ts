import { Conversation } from "./Conversation";
import { User } from "./User";

/**
 * Class represing a typing state
 */
export class Typing {
  author: User;
  conversation: Conversation;
}
