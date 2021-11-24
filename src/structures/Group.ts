import { Base } from "./Base";
import { GroupShout } from "./GroupShout";
import { User } from "./User";

/**
 * Represents a Roblox group
 * @alpha
 */
export class Group extends Base {
  /**the group's id*/
  readonly id: number;
  /**the group's name*/
  readonly name: string;
  /**the group's description*/
  readonly description: string;
  /**the group's description*/
  readonly owner: User;
  memberCount: number;
  readonly isBuilderClubOnly: boolean;
  readonly publicEntryAllowed: boolean;
  readonly isLocked: boolean;
  /**the group's description*/
  shout: GroupShout;

  /**
   * Creates a new group with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
    this.owner = new User(client, data.owner);
    this.shout = new GroupShout(client, data.shout);
  }
}
