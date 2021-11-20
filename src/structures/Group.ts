import { Base } from "./Base";
import { GroupShout } from "./GroupShout";
import { User } from "./User";

export class Group extends Base {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly owner;
  memberCount: number;
  readonly isBuilderClubOnly: boolean;
  readonly publicEntryAllowed: boolean;
  readonly isLocked: boolean;
  shout: GroupShout;

  constructor(client, data) {
    super(client);
    this.id = data.id;
    this.owner = new User(client, data.owner);
    this.shout = new GroupShout(client, data.shout);
  }
}
