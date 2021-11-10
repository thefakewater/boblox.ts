import {User} from './User';

/**
 * Class represing
 * @deprecated Use Client instead
 */
export class Self extends User {
  /**
   * Decline all friend requests
   */
  async declineAll() {
    await global.axios.post('https://friends.roblox.com/v1/user/friend-requests/decline-all', {});
  }
}
