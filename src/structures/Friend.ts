import { Conversation } from "./Conversation";
import { User } from "./User";

/**
 * Represents a friend of an user
 */
export class Friend extends User {
  /** Create a new friend
   * @param {Client} client
   * @param {any} data;
   */
  constructor(client, data) {
    super(client, data);
  }

  /**
   * Remove from friend list if user is a friend
   */
  async remove() {
    await global.axios.post(
      `//friends.roblox.com/v1/users/${this.id}/unfriend`,
      {}
    );
  }

  /**
   * Send a message to the user
   * @param {string} message
   */
  async send(message: string) {
    const payload = {
      participantUserId: this.id,
    };
    const res = await global.axios.post(
      "https://chat.roblox.com/v2/start-one-to-one-conversation",
      payload
    );
    const convId = res.data.conversation.id;
    const conversation = new Conversation();
    conversation.id = convId;
    conversation.send(message);
  }
}
