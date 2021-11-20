import { Client } from "..";

/**
 * Base data model.
 */
export abstract class Base {
  readonly client: Client;
  /**
   * Creates a new base.
   * @param client - the client that instancied this class
   * @internal
   */
  constructor(client: Client) {
    this.client = client;
  }
}
