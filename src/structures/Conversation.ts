import { utils } from "../util/Util";
import { Base } from "./Base";
import { User } from "./User";

/**
 * Class representing a conversation
 */
export class Conversation extends Base {
  id: number;
  /**
   * Must be fetched with Conversation.fetchParticipants
   */
  participants: User[] | null;

  constructor(client, data) {
    super(client);
    this.id = data.id;
  }
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
