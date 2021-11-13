import axios from 'axios';
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

import {WebSocket} from 'ws';
import {
  connectionData,
  REALTIME_ENDPOINT,
  ROBLOX_URL,
  START,
  USER_AGENT,
} from '../consts';
import {BaseClient} from '../structures/BaseClient';
import {Conversation} from '../structures/Conversation';
import {FriendRequest} from '../structures/FriendRequest';
import {Message} from '../structures/Message';
import {MinimalUser} from '../structures/MinimalUser';
import {Typing} from '../structures/Typing';
import {User} from '../structures/User';
import {utils} from '../util/Util';


/**
 * Class representing a client
 * @extends BaseClient
 */
export class Client extends BaseClient {
  private cookie: string;
  user: User;

  /**
   * Create a client
   */
  constructor() {
    super();
    this.user = new User();
  }
  /**
   * Login to Roblox
   * @param {string} cookie .ROBLOSECURITY
   * @return {string} cookie
   */
  async login(cookie: string) {
    if (!cookie) throw new Error('MISSING COOKIE');
    this.cookie = cookie;
    axios.defaults.headers.common['cookie'] = '.ROBLOSECURITY='+this.cookie;
    axios.defaults.headers.common['user-agent'] = USER_AGENT;
    let res = await axios.get('https://users.roblox.com/v1/users/authenticated');
    this.user.name = res.data.name;
    this.user.displayName = res.data.displayName;
    this.user.id = res.data.id;
    res = await axios.get('https://' + REALTIME_ENDPOINT + `/negotiate?clientProtocol=1.5&connectionData=${connectionData}&_=${Math.round(Date.now())}`);
    const token = encodeURIComponent(res.data.ConnectionToken);
    const client = new WebSocket('wss://' + REALTIME_ENDPOINT + `/connect?transport=webSockets&clientProtocol=1.5&connectionToken=${token}&connectionData=${connectionData}&tid=10`, {
      origin: ROBLOX_URL,
      perMessageDeflate: true,
      headers: {
        'cookie': '.ROBLOSECURITY'+'='+this.cookie,
        'user-agent': USER_AGENT,
      },
    });
    client.on('open', async () => {
      const date = Math.round(Date.now());
      res = await axios.get('https://' + REALTIME_ENDPOINT + START +
      `&connectionToken=${token}&connectionData=${connectionData}&_=${date}`);
      this.emit('ready');
      client.on('message', async (msg) => {
        const data = JSON.parse(msg.toString());
        if (data) {
          if (data.M) {
            const result = data.M[0];
            if (result.A[0] == 'ChatNotifications') {
              const data = JSON.parse(result.A[1]);
              if (data.Type == 'NewMessage') {
                const conversation = new Conversation();
                conversation.id = data.ConversationId;
                const message = await utils.getLatestMessage(conversation);
                this.emit('messageCreate', message);
              }
              if (data.Type == 'ParticipantTyping') {
                const conversation = new Conversation();
                conversation.id = data.ConversationId;
                const typing = new Typing();
                typing.conversation = conversation;
                typing.author = await utils.getUserFromId(data.UserId);
                this.emit('typingStart', typing);
              }
            } else if (result.A[0] == 'FriendshipNotifications') {
              const data = JSON.parse(result.A[1]);
              if (data.Type == 'FriendshipRequested') {
                const args = data.EventArgs;
                if (this.user.id != args.UserId1) {
                  const requester = await utils.getUserFromId(args.UserId1);
                  const friendRequest = new FriendRequest();
                  friendRequest.author = requester;
                  this.emit('friendRequest', friendRequest);
                }
              }
              if (data.Type == 'FriendshipDestroyed') {
                const args = data.EventArgs;
                const partner = await utils.getUserFromId(args.UserId2);
                if (partner.id != this.user.id) {
                  this.emit('friendDestroy', partner);
                }
              }
              if (data.Type == 'FriendshipCreated') {
                const args = data.EventArgs;
                const partner = await utils.getUserFromId(args.UserId1);
                if (partner.id == this.user.id) {
                  return this.emit('newFriend',
                      await utils.getUserFromId(args.UserId2));
                }
                this.emit('newFriend', partner);
              }
            }
          }
        }
      });
    });
    return cookie;
  }

  /**
   * Search users with a keyword
   * @param {string} keyword
   * @param {number} limit The number of results
   * @return {Promise<MinimalUser>} A list of minimal users
   */
  async search(keyword: string, limit: number = 10) {
    let res;
    try {
      res = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`);
    } catch (err) {
      if (err.response.status == 400) {
        return null;
      }
    }
    const data = res.data.data;
    const minimalUsers: MinimalUser[] = [];
    for (let i=0; i < data.length; i++) {
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
    await utils.getCSRFToken();
    const config = {
      headers: {
        'x-csrf-token': utils.token,
      },
    };
    if (typeof(message) == 'string' && conversationId) {
      const payload = {
        message: message,
        conversationId: conversationId,
      };
      try {
        await global.axios.post('https://chat.roblox.com/v2/send-message', payload, config);
      } catch (err) {
        throw new Error('Invalid conversation id');
      }
    }

    if (message instanceof Message) {
      message.conversation.send(message.content);
    }
  }

  /**
   * Decline all friend requests
   */
  async declineAll() {
    await global.axios.post('https://friends.roblox.com/v1/user/friend-requests/decline-all', {});
  }
}

