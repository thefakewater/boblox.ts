import { Group } from "./Group";
import { User } from "./User";

export class Member extends User {
  group: Group;
  constructor(client, data) {
    super(client, data);
    this.group = data.group;
  }
}
