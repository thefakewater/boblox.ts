import { Base } from "..";

/**
 * Statistics for a badge.
 * @public
 */
export interface Statistics {
  /**The amount of days this badge has been earned*/
  readonly pastDayAwardedCount: number;
  /**The number of users who got the badge.*/
  readonly awardedCount: number;
  /**The percentage of win the badge has.*/
  readonly winRatePercentage: number;
}
/**
 * The game's info which the badge belongs to.
 * @public
 */
export interface AwardingUniverse {
  /**The place's id.*/
  readonly id: number;
  /**The place's name.*/
  readonly name: number;
  /**The root place's id.*/
  readonly rootPlaceId: number;
}

/**
 *
 */
/**
 * Represents a badge on Roblox.
 */
export class Badge extends Base {
  /**The unique id of the badge. */
  readonly id: number;
  /**The name of the badge. */
  readonly name: string;
  /**The description of the badge. */
  readonly description: string;
  /**The display name of the badge. */
  readonly displayName: string;
  /**The display description of the badge. */
  readonly displayDescription: string;
  /**Wether the badge is enabled or not. */
  readonly enabled: boolean;
  /**The image id of the badge's icon.*/
  readonly iconImageId: number;
  /**The display image id of the badge's icon.*/
  readonly displayIconImageId: number;
  /**When the badge was created.*/
  readonly created: Date;
  /**When the badge was updated.*/
  readonly updated: Date;
  /**{@inheritdoc Statistics}*/
  readonly statistics: Statistics;
  /**{@inheritdoc AwardingUniverse}*/
  readonly awardingUniverse: AwardingUniverse;
  /**
   * Creates a new badge with the json response from API call.
   * @param client - the client that instancied this class
   * @param data - the json response from API call
   * @internal
   */
  constructor(client, data) {
    super(client);
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.displayName = data.displayName;
    this.displayDescription = data.displayDescription;
    this.enabled = data.enabled;
    this.iconImageId = data.iconImageId;
    this.displayIconImageId = data.displayIconImageId;
    this.created = new Date(data.created);
    this.updated = new Date(data.updated);
    this.statistics = data.statistics;
    this.awardingUniverse = data.awardingUniverse;
  }
}
