import { Client } from "..";
import { Base } from "./Base";

interface Scales {
  height: number;
  width: number;
  head: number;
  depth: number;
  proportion: number;
  bodyType: number;
}

interface BodyColors {
  headColorId: number;
  torsoColorId: number;
  rightArmColorId: number;
  leftArmColorId: number;
  rightLegColorId: number;
  leftLegColorId: number;
}

interface Asset {
  id: number;
  name: string;
  assetType: { id: number; name: string };
  currentVersionId: number;
  meta: { order: number; puffiness: number; version: number };
}

interface Emote {
  assetId: number;
  assetName: string;
  position: number;
}

/**
 * Represents an user's avatar.
 */
export class Avatar extends Base {
  scales: Scales;
  avatarType: "R6" | "R15";
  bodyColors: BodyColors;
  /** A list of all assets which the avatar is wearing. */
  assets: Asset[];
  defaultShirtApplied: boolean;
  defaultPantsApplied: boolean;
  /** A list of all emotes which the avatar has equipped. */
  emotes: Emote[];

  /**
   * Creates a avatar with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client: Client, data) {
    super(client);
    this.avatarType = data.playerAvatarType;
    this.bodyColors = data.bodyColors;
    this.assets = data.assets;
    this.defaultShirtApplied = data.defaultShirtApplied;
    this.defaultPantsApplied = data.defaultPantsApplied;
    this.emotes = data.emotes;
  }
}
