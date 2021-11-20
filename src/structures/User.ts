import { Avatar } from "./Avatar";
import { Base } from "./Base";
import { Friend } from "./Friend";

/**
 * Represents a user on Roblox
 * @extends Base
 */
export class User extends Base {
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
  isFriend: boolean;

  /**
   * Create a new user
   * @param {Client} client
   * @param {string} data
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
   * Get all friends of the user
   * @return {Promise<User>} List of users
   */
  async getFriends() {
    const res = await global.axios.get(
      `https://friends.roblox.com/v1/users/${this.id}/friends`
    );
    const data = res.data.data;
    const friends: Friend[] = [];
    for (let i = 0; i < data.length; i++) {
      const friend = new Friend(this, data[i]);
      friends.push(friend);
    }
    return friends;
  }

  /**
   * Add the user as friend
   */
  async addFriend() {
    try {
      await global.axios.post(
        `https://friends.roblox.com/v1/users/${this.id}/request-friendship`,
        {}
      );
    } catch (err) {
      return err;
    }
  }
}
