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
 * Represents an user's avatar
 */
export class Avatar extends Base {
  scales: Scales;
  avatarType: "R6" | "R15";
  bodyColors: BodyColors;
  assets: Asset[];
  defaultShirtApplied: boolean;
  defaultPantsApplied: boolean;
  emotes: Emote[];

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
