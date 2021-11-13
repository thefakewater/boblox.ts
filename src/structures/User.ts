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
  async remove() {
    if (this.isFriend) {
      await utils.getCSRFToken();
      const config = {
        headers: {
          'x-csrf-token': utils.token,
        },
      };
      await global.axios.post(`https://friends.roblox.com/v1/users/${this.id}/unfriend`, {}, config);
      return;
    }
    console.log('User is not a friend');
  }
  /**
   * Add the user as friend
   */
  async addFriend() {
    await utils.getCSRFToken();
    const config = {
      headers: {
        'x-csrf-token': utils.token,
      },
    };
    let res;
    try {
      res = await global.axios.post(`https://friends.roblox.com/v1/users/${this.id}/request-friendship`, {}, config);
    } catch (err) {
      return err;
    }
    if (!res.isCaptchaRequired) throw new Error('We are rate limited');
  }

  /**
   * Get all friends of the user
   * @return {Promise<User>} List of users
   */
  async getFriends() {
    const res = await global.axios.get(`https://friends.roblox.com/v1/users/${this.id}/friends`);
    const res = await global.axios.get(
      `https://friends.roblox.com/v1/users/${this.id}/friends`
    );
    const data = res.data.data;
    const friends: User[] = [];
    for (let i=0; i < data.length; i++) {
      const friend = new User();
      friend.id = data[i].id;
      friend.name = data[i].name;
      friend.displayName = data[i].displayName;
      friend.isBanned = data[i].isBanned;
      friend.description = data[i].description;
      friend.isFriend = true;
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
