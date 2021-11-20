import { Avatar } from "./Avatar";
import { Base } from "./Base";
import { Conversation } from "./Conversation";

/**
 * Represents a friend of an user.
 */
export class Friend extends Base {
  /** The user's avatar.
   * @remarks Must be fetched with fetchAvatar.
   */
  avatar: Avatar | null;
  readonly createdAt: Date;
  readonly id: number;
  readonly name: string;
  description: string | null;
  isBanned: boolean;
  displayName: string | null;

  /** Creates a friend with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
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
   * Removes a friend from friend list.
   * @public
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
   * Sends a message to the user
   * @param message - the message to send
   * @public
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
