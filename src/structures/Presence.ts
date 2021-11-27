import { User } from "./User";
import { Base } from "./Base";
import { utils } from "../util/Util";

/**
 * Represents the presence of an user.
 */
export class Presence extends Base {
  /** Offline | online | playing.*/
  readonly userPresenceType: string;
  /** The last location on website.
   * @example Home, GameDetail
   */
  readonly lastLocation: string;
  /** The place id of the game if the user is playing.*/
  readonly placeId: number | null;
  /** The root place id if the user is playing.*/
  readonly rootPlaceId: number | null;
  /** The game id if the user is playing.*/
  readonly gameId: string | null;
  /** The universe id if the user is playing.*/
  readonly universeId: number | null;
  /** The user who holds the presence.*/
  user: User;
  /** The last time the player connected to Roblox.*/
  readonly lastOnline: Date;
  /** The json response call from API call.
   * @internal
   * @remarks This is only used for internal work this property will be null when fetchUser is called.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private data: any;
  /**
   * Creates a new presence with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    this.data = data;
    this.userPresenceType = data.userPresenceType;
    this.lastLocation = data.lastLocation;
    this.placeId = data.placeId;
    this.rootPlaceId = data.rootPlaceId;
    this.gameId = data.gameId;
    this.universeId = data.universeId;
    this.lastOnline = new Date(data.lastOnline);
  }

  /**
   * Fetches the user who holds this presence.
   * @public
   */
  async fetchUser() {
    this.user = await utils.getUserFromId(this.client, this.data.userId);
    this.data = null;
  }
}
