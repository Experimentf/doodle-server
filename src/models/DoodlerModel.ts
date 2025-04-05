/**
 * FOR USE INSIDE DOODLER SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE DOODLER INTERFACE INSTEAD
 */
export class DoodlerModel {
  public readonly id: string;
  public readonly name: string;
  public readonly avatar: object;
  private _score: number;

  constructor(id: string, name: string, avatar: object) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this._score = 0;
  }

  incrementScore(value: number) {
    this._score = value;
  }

  clearScore() {
    this._score = 0;
  }

  public get score() {
    return this._score;
  }

  public get json() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar,
      score: this._score
    };
  }
}
