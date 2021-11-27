import { Client, Friend } from "..";
import { Avatar } from "./Avatar";
import { Group } from "./Group";
import { Message } from "./Message";
import { MinimalUser } from "./MinimalUser";
import { User } from "./User";

/**
 * Represents the logged in Roblox client user.
 */
export class ClientUser extends User {
  /**
   * Creates a new client.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client: Client, data) {
    super(client, data);
  }

  /**
   * Sets the description of the logged in user's client.
   * @param description - the description you want to change to
   * @public
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
   * Declines all friend requests.
   * @public
   */
  async declineAll() {
    await global.axios.post(
      "https://friends.roblox.com/v1/user/friend-requests/decline-all",
      {}
    );
  }

  /**
   * Searches users with a keyword.
   * @param keyword
   * @param limit - Default is 10 results
   * @remarks Do not pass a second parameter.
   * @return a list of minimal users
   * @beta
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
   * Sends a message to a specific conversation with an id.
   * @param message - the message you want to send a `string` or a `Message`
   * @param conversationId - the conversation id
   * @public
   * @remarks This function is only useful if you have a specific conversation id.
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

  /**
   * Gets the avatar of the logged in user.
   * @returns the avatar of the logged in user
   * @public
   */
  async getAvatar(): Promise<Avatar> {
    const res = await global.axios.get(`https://avatar.roblox.com/v1/avatar`);
    return new Avatar(this.client, res.data);
  }

  async getGroup(id: number): Promise<Group> {
    const res = await global.axios.get(
      "https://groups.roblox.com/v1/groups/" + id
    );
    return new Group(this.client, res.data);
  }
  /**
   * Get the friend object
   * @param client - the client that instancied this class
   * @public
   * @returns A friend object.
   */
  async getFriendFromId(id: number): Promise<Friend> {
    const res = await global.axios.get(
      "https://friends.roblox.com/v1/users/" + this.id + "/friends"
    );
    const data = res.data.data;
    let friendData;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        friendData = data[i];
        break;
      }
    }
    if (friendData) return new Friend(this.client, friendData);
    throw new Error("Could not find friend with id " + id);
  }
}
