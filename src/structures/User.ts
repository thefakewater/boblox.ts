import {utils} from '../util/Util';
import {Conversation} from './Conversation';
import {MinimalUser} from './MinimalUser';

/**
 * Class representing an user
 * @extends MinimalUser
 */
export class User extends MinimalUser {
  isBanned: boolean;
  description: string;
  friendsCount: number;
  isFriend: boolean = false;

  /**
   * Remove from friend list if user is a friend
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
   * Send a message to the user
   * @param {string} message
   */
  async send(message: string) {
    await utils.getCSRFToken();
    const config = {
      headers: {
        'x-csrf-token': utils.token,
      },
    };
    const payload = {
      participantUserId: this.id,
    };
    const res = await global.axios.post('https://chat.roblox.com/v2/start-one-to-one-conversation', payload, config);
    const convId = res.data.conversation.id;
    const conversation = new Conversation();
    conversation.id = convId;
    conversation.send(message);
  }
}
