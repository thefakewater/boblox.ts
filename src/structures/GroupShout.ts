import { Base } from "./Base";

/**
 * Represents a group Shout.
 * The group shout is a message that shows to everyone in the group.
 * @alpha
 */
export class GroupShout extends Base {
  body: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  poster: any;
  readonly created: Date;
  readonly updated: Date;
  /**
   * Creates a new group shout with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    if ("body" in data) this.body = data.body;
    if ("poster" in data) this.poster = data.poster;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
