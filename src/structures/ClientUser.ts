import { Client } from "..";
import { Message } from "./Message";
import { MinimalUser } from "./MinimalUser";
import { User } from "./User";

/**
 * Represents the logged in Roblox client user
 */
export class ClientUser extends User {
  /**
   * Create a new client
   * @param {Client} client
   * @param {any} data
   */
  constructor(client: Client, data) {
    super(client, data);
  }

  /**
   * Set the description of the logged in user's client
   * @param {string} description
   */
  async setDescription(description: string) {
    const payload = {
      description: description,
    };
    try {
      await global.axios.post(
        "https://accountinformation.roblox.com/v1/description",
        payload
      );
    } catch (err) {
      if (err.response.status == 403) throw new Error("PIN is locked");
    }
  }

  /**
   * Decline all friend requests
   */
  async declineAll() {
    await global.axios.post(
      "https://friends.roblox.com/v1/user/friend-requests/decline-all",
      {}
    );
  }

  /**
   * Search users with a keyword
   * @param {string} keyword
   * @param {number} limit The number of results
   * @return {Promise<MinimalUser>} A list of minimal users
   */
  async search(keyword: string, limit = 10) {
    let res;
    try {
      res = await global.axios.get(
        `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`
      );
    } catch (err) {
      if (err.response.status == 400) {
        return null;
      }
    }
    const data = res.data.data;
    const minimalUsers: MinimalUser[] = [];
    for (let i = 0; i < data.length; i++) {
      const minUser = new MinimalUser();
      minUser.id = data[i].id;
      minUser.name = data[i].name;
      minUser.displayName = data[i].displayName;
      minimalUsers.push(minUser);
    }
    return minimalUsers;
  }

  /**
   * Send a message to a specific conversation with an id
   * @param {Message | string} message
   * @param {number | null} conversationId
   */
  async send(message: string | Message, conversationId: number | null = null) {
    if (typeof message == "string" && conversationId) {
      const payload = {
        message: message,
        conversationId: conversationId,
      };
      try {
        await global.axios.post(
          "https://chat.roblox.com/v2/send-message",
          payload
        );
      } catch (err) {
        throw new Error("Invalid conversation id");
      }
    }

    if (message instanceof Message) {
      message.conversation.send(message.content);
    }
  }
}
