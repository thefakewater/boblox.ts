import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { Friend, FriendRequest, Message, Typing, User } from "..";

export interface ClientEvents {
  ready: () => void;
  messageCreate: (message: Message) => void;
  friendRequest: (friendRequest: FriendRequest) => void;
  friendDestroy: (partner: User) => void;
  newFriend: (friend: Friend) => void;
  typingStart: (typing: Typing) => void;
}
/**
 * Class representing the base class of client
 */
export class BaseClient extends (EventEmitter as new () => TypedEmitter<ClientEvents>) {}
