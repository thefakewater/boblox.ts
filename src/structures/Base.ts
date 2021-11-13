import { Client } from "..";

/**
 * Base data model
 */
export abstract class Base {
  readonly client: Client;
  /**
   * Create a new base
   * @param {Client} client
   */
  constructor(client) {
    this.client = client;
  }
}
