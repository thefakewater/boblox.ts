import axios from "axios";
import { open } from "opn-url";

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
  BADGE_ENDPOINT,
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
import { Badge, RequestHandler } from "..";

/**
 * Class representing the local Roblox client.
 */
export class Client extends BaseClient {
  user: ClientUser;
  readonly handler: RequestHandler;
  /**
   * Creates a client.
   * @public
   */
  constructor() {
    super();
    this.handler = new RequestHandler();
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
                const partner = await this.user.getFriendFromId(args.UserId1);
                if (partner.id == this.user.id) {
                  return this.emit(
                    "newFriend",
                    await this.user.getFriendFromId(args.UserId2)
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
  /**
   * Gets badge with specified id.
   * @param id - the badge id
   * @see {@link https://en.help.roblox.com/hc/en-us/articles/203313620}
   * @public
   * @returns The {@link Badge} if found.
   */
  async getBadge(id: number): Promise<Badge> {
    try {
      const res = await axios.get(BADGE_ENDPOINT + "/v1/badges/" + id);
      return new Badge(this, res.data);
    } catch (err) {
      if (err.response.status == 404) {
        throw new Error("Could not find badge with id " + id);
      }
    }
  }

  /**
   * Joins game with a game id.
   * @param id - the game id
   * @remarks This method only works on Windows operating system.
   * @experimental
   */
  async joinGame(id: number) {
    const config = {
      headers: {
        "user-agent": "Roblox/WinInet",
        referer: "https://www.roblox.com/develop",
        "RBX-For-Gameauth": "true",
      },
    };
    const res = await axios.post(
      "https://auth.roblox.com/v1/authentication-ticket/",
      {},
      config
    );
    const authToken = res.headers["rbx-authentication-ticket"];
    const launchTime = Math.round(Date.now());
    const browserTrackerId = Math.random() * 100;
    const url = `roblox-player:1+launchmode:play+gameinfo:${authToken}+launchtime:${launchTime}+placelauncherurl:https://assetgame.roblox.com/game/PlaceLauncher.ashx?request=RequestGame&browserTrackerId=${browserTrackerId}&placeId=${id}&isPlayTogetherGame=false+browsertrackerid:${browserTrackerId}+robloxLocale:en_us+gameLocale:en_us`;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Mutex = require("windows-mutex").Mutex;
      new Mutex("ROBLOX_singletonMutex");
    } catch (err) {
      throw new Error("You are not on Windows");
    }
    open(url);
  }
}
