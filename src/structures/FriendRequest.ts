import {utils} from '../util/Util';
import {User} from './User';

/**
 * Class representing a friend request
*/
export class FriendRequest {
  author: User;

  /**
   * Accept a friend request
   */
  async accept() {
    await global.axios.post(
      `https://friends.roblox.com/v1/users/${this.author.id}/accept-friend-request`,
      {}
    );
  }
  /**
   * Decline a friend request
   */
  async decline() {
    await global.axios.post(
      `https://friends.roblox.com/v1/users/${this.author.id}/decline-friend-request`,
      {}
    );
  }
}
