import { Base } from "./Base";
import { User } from "./User";

/**
 * Class representing a conversation.
 */
export class Conversation extends Base {
  id: number;
  /**
   * The participants of a conversation.
   * @remarks Must be fetched with Conversation.fetchParticipants.
   * @alpha
   */
  participants: User[] | null;

  /**
   * Creates a conversation object with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
  }
  /**
   * Sends a message to the conversation.
   * @param message - the message to send
   * @public
   */
  async send(message: string) {
    const payload = {
      message: message,
      conversationId: this.id,
    };
    await global.axios.post("https://chat.roblox.com/v2/send-message", payload);
  }
}
