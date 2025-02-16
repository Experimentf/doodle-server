/**
 * FOR USE INSIDE DOODLER SERVICE ONLY
 * TO SEND DATA TO CLIENT OR ANOTHER SERVICE, USE DOODLER INTERFACE INSTEAD
 */
export class DoodlerModel {
  public readonly id: string;
  public readonly name: string;
  public readonly avatar: object;

  constructor(id: string, name: string, avatar: object) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
  }

  public get json() {
    return {
      id: this.id,
      name: this.name,
      avatar: this.avatar
    };
  }
}
