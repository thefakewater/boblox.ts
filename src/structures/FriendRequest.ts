import { User } from "./User";

/**
 * Class representing a friend request.
 */
export class FriendRequest {
  author: User;

  /**
   * Accepts a friend request.
   * @public
   */
  async accept() {
    await global.axios.post(
      `https://friends.roblox.com/v1/users/${this.author.id}/accept-friend-request`,
      {}
    );
  }
  /**
   * Declines a friend request.
   * @public
   */
  async decline() {
    await global.axios.post(
      `https://friends.roblox.com/v1/users/${this.author.id}/decline-friend-request`,
      {}
    );
  }
}
