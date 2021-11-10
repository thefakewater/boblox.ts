
import {utils} from '../util/Util';
import {User} from './User';

/**
 * Class representing a conversation
 */
export class Conversation {
  id: number;
  members: User[];


  /**
   * Send a message to a conversation
   * @param {string} message The message to send
   */
  async send(message: string) {
    await utils.getCSRFToken();
    const config = {
      headers: {
        'x-csrf-token': utils.token,
      },
    };
    const payload = {
      message: message,
      conversationId: this.id,
    };
    await global.axios.post('https://chat.roblox.com/v2/send-message', payload, config);
  }
}
