/* eslint-disable @typescript-eslint/no-namespace */
import { LOCATION_HOME, PRESENCE_ENDPOINT } from "../consts";
import { Conversation } from "../structures/Conversation";
import { Message } from "../structures/Message";
import { User } from "../structures/User";

export namespace utils {
  // eslint-disable-next-line prefer-const
  export let token = "unknown";
  /**
   * Get the latest message from a conversation
   * @param {Client} client
   * @param {Conversation} conv The conversation object
   * @return {Promise<Message>} The latest message from conversation
   */
  export async function getLatestMessage(client, conv: Conversation) {
    const res = await global.axios.get(
      `https://chat.roblox.com/v2/get-messages?conversationId=${conv.id}&pageSize=1`
    );
    const msg_ = res.data[0];
    const message = new Message();
    const author = await getUserFromId(client, msg_.senderTargetId);
    message.author = author;
    message.content = msg_.content;
    message.conversation = conv;
    return message;
  }

    /**
     * Get user object from user id
     * @param {number} id The user id
     * @return {Promise<User>} User
     */
    export async function getUserFromId(id:number) {
      const user = new User();
      let res = await global.axios.get('https://users.roblox.com/v1/users/' + id);
      user.description = res.data.description;
      user.isBanned = res.data.isBanned;
      user.id = res.data.id;
      user.name = res.data.name;
      user.displayName = res.data.displayName;
      res = await global.axios.get('https://friends.roblox.com/v1/users/' + id + '/friends/count');
      user.friendsCount = res.data.count;
      return user;
    }

    /**
     * Set the cross-site request forgery token
     */
    export async function getCSRFToken() {
      const config = {
        headers: {
          'x-csrf-token': utils.token,
        },
      };
      try {
        await global.axios.post(PRESENCE_ENDPOINT, LOCATION_HOME, config);
      } catch (err) {
        utils.token = err.response.headers['x-csrf-token'];
      }
    }
}

