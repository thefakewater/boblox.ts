import { Avatar } from "./Avatar";
import { Base } from "./Base";

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
   * Remove from friend list if user is a friend
   * Create a new user
   * @param {Client} client
   * @param {string} data
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
    this.name = data.name;
    if ("displayName" in data) {
      this.displayName = data.displayName;
    }
    }
    if (!res.isCaptchaRequired) throw new Error('We are rate limited');
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
    const friends: User[] = [];
    for (let i = 0; i < data.length; i++) {
      const friend = new User(this, data[i]);
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
