import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      if (err.response.status == 401) {
        throw new Error("Invalid cookie");
      }
    }
    return Promise.reject(err);
  }
);

axios.interceptors.request.use(
  async (request) => {
    if (request) {
      if (
        request.method == "post" &&
        !request.url.startsWith("https://presence.roblox.com/")
      ) {
        await utils.getCSRFToken();
        request.headers["x-csrf-token"] = utils.token;
      }
    }
    return request;
  },
  (err) => {
    throw new Error(err);
  }
);

global.axios = axios;

import { WebSocket } from "ws";
import {
  connectionData,
  REALTIME_ENDPOINT,
  ROBLOX_URL,
  START,
  USER_AGENT,
} from "../consts";
import { BaseClient } from "../structures/BaseClient";
import { Conversation } from "../structures/Conversation";
import { FriendRequest } from "../structures/FriendRequest";
import { Typing } from "../structures/Typing";
import { ClientUser } from "../structures/ClientUser";
import { utils } from "../util/Util";

/**
 * Class representing the local Roblox client.
 */
export class Client extends BaseClient {
  user: ClientUser;

  /**
   * Creates a client.
   * @public
   */
  constructor() {
    super();
  }
  /**
   * Logins the client to Roblox.
   * @param cookie - a `.ROBLOSECURITY` cookie
   * @see the documentation to get your cookie
   * @returns the cookie parameter if this was successful
   * @public
   */
  async login(cookie: string): Promise<string> {
    if (!cookie) throw new Error("MISSING COOKIE");
    cookie = ".ROBLOSECURITY=" + cookie;
    axios.defaults.headers.common["cookie"] = cookie;
    axios.defaults.headers.common["user-agent"] = USER_AGENT;
    let res = await axios.get(
      "https://users.roblox.com/v1/users/authenticated"
    );
    this.user = new ClientUser(this, res.data);
    res = await axios.get(
      "https://" +
        REALTIME_ENDPOINT +
        `/negotiate?clientProtocol=1.5&connectionData=${connectionData}&_=${Math.round(
          Date.now()
        )}`
    );
    const token = encodeURIComponent(res.data.ConnectionToken);
    const client = new WebSocket(
      "wss://" +
        REALTIME_ENDPOINT +
        `/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${token}&connectionData=${connectionData}&tid=10`,
      {
        origin: ROBLOX_URL,
        perMessageDeflate: true,
        headers: {
          cookie: cookie,
          "user-agent": USER_AGENT,
        },
      }
    );
    client.on("open", async () => {
      const date = Math.round(Date.now());
      res = await axios.get(
        "https://" +
          REALTIME_ENDPOINT +
          START +
          `&connectionToken=${token}&connectionData=${connectionData}&_=${date}`
      );
      this.emit("ready");
      client.on("message", async (msg) => {
        const data = JSON.parse(msg.toString());
        if (data) {
          if (data.M) {
            const result = data.M[0];
            if (result.A[0] == "ChatNotifications") {
              const data = JSON.parse(result.A[1]);
              if (data.Type == "NewMessage") {
                const conversation = new Conversation(this, {
                  id: data.ConversationId,
                });
                const message = await utils.getLatestMessage(
                  this,
                  conversation
                );
                this.emit("messageCreate", message);
              }
              if (data.Type == "ParticipantTyping") {
                const conversation = new Conversation(this, {
                  id: data.ConversationId,
                });
                const typing = new Typing();
                typing.conversation = conversation;
                typing.author = await utils.getUserFromId(this, data.UserId);
                this.emit("typingStart", typing);
              }
            } else if (result.A[0] == "FriendshipNotifications") {
              const data = JSON.parse(result.A[1]);
              if (data.Type == "FriendshipRequested") {
                const args = data.EventArgs;
                if (this.user.id != args.UserId1) {
                  const requester = await utils.getUserFromId(
                    this,
                    args.UserId1
                  );
                  const friendRequest = new FriendRequest();
                  friendRequest.author = requester;
                  this.emit("friendRequest", friendRequest);
                }
              }
              if (data.Type == "FriendshipDestroyed") {
                const args = data.EventArgs;
                const partner = await utils.getUserFromId(this, args.UserId2);
                if (partner.id != this.user.id) {
                  this.emit("friendDestroy", partner);
                }
              }
              if (data.Type == "FriendshipCreated") {
                const args = data.EventArgs;
                const partner = await utils.getUserFromId(this, args.UserId1);
                if (partner.id == this.user.id) {
                  return this.emit(
                    "newFriend",
                    await utils.getUserFromId(this, args.UserId2)
                  );
                }
                this.emit("newFriend", partner);
              }
            }
          }
        }
      });
    });
    return cookie;
  }
}