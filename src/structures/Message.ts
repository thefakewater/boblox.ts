import { Typing } from "./Typing";

/**
 * Class representing a message.
 */
export class Message extends Typing {
  content: string;

  /**
   * Replies to a message.
   * @param message - the text you want to reply with
   * @public
   */
  async reply(message: string) {
    this.conversation.send(message);
  }
}
