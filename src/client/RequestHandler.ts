import { EventEmitter } from "events";

export enum RequestTypes {
  GLOBAL = -1,
  FRIENDS = 20,
}
const MINUTE = 60000;

export class RequestHandler extends EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queue = [];
  maxPerMinute = -1;
  constructor(options?: { maxPerMinute: number }) {
    super();
    if (options) this.maxPerMinute = options.maxPerMinute;
  }
  async push(request, type?: number) {
    this.emit("push", request);
    if (!type) type = this.maxPerMinute;
    this.queue.push({
      call: request,
      type: type,
    });
    request = this.queue.shift();
    if (request) {
      await request.call();
      await new Promise((r) => setTimeout(r, MINUTE / type));
    }
  }
}
