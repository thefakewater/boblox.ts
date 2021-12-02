import { RequestTypes } from "..";
import { Avatar } from "./Avatar";
import { Base } from "./Base";
import { Friend } from "./Friend";
import { Presence } from "./Presence";

/**
 * Represents an user on Roblox.
 */
export class User extends Base {
  /** The user's avatar
   * @remarks Must be fetched with User.fetchAvatar.
   */
  avatar: Avatar | null;
  readonly createdAt: Date;
  readonly id: number;
  readonly name: string;
  description: string | null;
  isBanned: boolean;
  displayName: string | null;
  isFriend: boolean;

  /**
   * Creates a new user with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    this.id = data.id || data.userId;
    this.name = data.name || data.username;
    if ("displayName" in data) {
      this.displayName = data.displayName;
    }
    if ("description" in data) {
      this.description = data.description;
    }
    if ("isFriend" in data) {
      this.isFriend = data.isFriend;
    }
  }
  /**
   * Gets all friends of the user.
   * @returns List of users
   * @public
   */
  async getFriends() {
    const request = async () => {
      return await global.axios.get(
        `https://friends.roblox.com/v1/users/${this.id}/friends`
      );
    };
    const res = await this.client.handler.push(request, RequestTypes.FRIENDS);
    const data = res.data.data;
    const friends: Friend[] = [];
    for (let i = 0; i < data.length; i++) {
      const friend = new Friend(this, data[i]);
      friends.push(friend);
    }
    return friends;
  }

  /**
   * Adds the user as friend.
   * @public
   */
  async addFriend() {
    try {
      const request = async () => {
        await global.axios.post(
          `https://friends.roblox.com/v1/users/${this.id}/request-friendship`,
          {}
        );
      };
      await this.client.handler.push(request, RequestTypes.FRIENDS);
    } catch (err) {
      return err;
    }
  }
  /**
   * Gets the presence of the user.
   * @public
   * @returns Promise<Presence>
   */
  async getPresence(): Promise<Presence> {
    const data = await global.axios.post(
      "https://presence.roblox.com/v1/presence/users",
      { userIds: [this.id] }
    );
    return new Presence(this.client, data.data.userPresences[0]);
  }
}
