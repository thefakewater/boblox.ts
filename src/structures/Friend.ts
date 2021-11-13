import { Avatar } from "./Avatar";
import { Base } from "./Base";
import { Conversation } from "./Conversation";

/**
 * Represents a friend of an user
 */
export class Friend extends Base {
  /** The user's avatar
   * @info Must be fetched with fetchAvatar
   */
  avatar: Avatar | null;
  readonly createdAt: Date;
  readonly id: number;
  readonly name: string;
  description: string | null;
  isBanned: boolean;
  displayName: string | null;

  /** Create a new friend
   * @param {Client} client
   * @param {any} data;
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
    this.name = data.name;
    if ("displayName" in data) {
      this.displayName = data.displayName;
    }
    if ("description" in data) {
      this.description = data.description;
    }
  }

  /**
   * Remove from friend list if user is a friend
   */
  async remove() {
    try {
      await global.axios.post(
        `https://friends.roblox.com/v1/users/${this.id}/unfriend`,
        {}
      );
    } catch (err) {
      if (err.response.status == 400) {
        throw new Error(err.response.data.errors[0].message);
      }
    }
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
    new Conversation(this.client, res.data.conversation).send(message);
  }
}
