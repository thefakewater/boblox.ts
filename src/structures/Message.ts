import {Typing} from './Typing';


/**
 * Class representing a message
 * @extends Typing
 */
export class Message extends Typing {
  content: string;

  /**
   * Reply to a message
   * @param {string} message
   */
  async reply(message: string) {
    this.conversation.send(message);
  }
}
