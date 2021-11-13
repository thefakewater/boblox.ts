import { User } from "./User";

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
    const payload = {
      message: message,
      conversationId: this.id,
    };
    await global.axios.post("https://chat.roblox.com/v2/send-message", payload);
  }
}
