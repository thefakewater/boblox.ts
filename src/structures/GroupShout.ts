import { Base } from "./Base";

export class GroupShout extends Base {
  body: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  poster: any;
  readonly created: Date;
  readonly updated: Date;
  constructor(client, data) {
    super(client);
    if ("body" in data) this.body = data.body;
    if ("poster" in data) this.poster = data.poster;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
  }
}
