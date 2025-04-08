import { DoodlerModel } from '@/models/DoodlerModel';
import { DoodleServerError } from '@/utils/error';

import { DoodlerServiceInterface } from './interface';

class DoodlerService implements DoodlerServiceInterface {
  private readonly _doodlers: Map<string, DoodlerModel> = new Map<
    string,
    DoodlerModel
  >(); // DOODLER ID -> DOODLER DETAILS

  /**
   * Add a doodler to the list of doodlers
   * @param doodlerProps Properties to be set for the new doodler
   * @returns New Doodler's ID
   */
  public async addDoodler(doodlerProps: {
    id: string;
    name: string;
    avatar: object;
  }) {
    const { id, name, avatar } = doodlerProps;
    const doodlerModel = new DoodlerModel(id, name, avatar);
    this._doodlers.set(id, doodlerModel);
    return doodlerModel.json;
  }

  /**
   *
   * @param doodlerId Doddler's id that needs to be removed
   * @returns true | false
   */
  public async removeDoodler(doodlerId: string) {
    return this._doodlers.delete(doodlerId);
  }

  /**
   * Find a doodler via id
   * @param doodlerId Doodler's id that needs to be found
   * @returns Doodler
   */
  public async findDooder(doodlerId: string) {
    const doodlerModel = this._doodlers.get(doodlerId);
    if (!doodlerModel) throw new DoodleServerError('Doodler not found!');
    return doodlerModel.json;
  }

  /**
   * Get all doodlers by doodler ids
   * @param doodlerIds Doodler IDs for which doodlers are requested
   * @returns - Array of Doodlers
   */
  public async getDoodlers(doodlerIds: string[]) {
    const resultLength = doodlerIds.length;
    const doodlers = await Promise.all(
      doodlerIds.map(async (id) => {
        const doodler = await this.findDooder(id);
        return doodler;
      })
    );
    if (doodlers.length !== resultLength) throw new DoodleServerError();
    return doodlers;
  }

  /**
   * Incremenet the doodler score by a value
   * @param doodlerId Doodler Id
   * @param value Value to increment
   */
  public async incrementScore(doodlerId: string, value: number) {
    const doodler = await this._findDooderModel(doodlerId);
    doodler.incrementScore(value);
    console.log(doodler.score);
  }

  public async clearScore(doodlerId: string) {
    const doodler = await this._findDooderModel(doodlerId);
    doodler.clearScore();
  }

  // PRIVATE METHODS

  /**
   * Find a doodler via id
   * @param doodlerId Doodler's id that needs to be found
   * @returns Doodler
   */
  private async _findDooderModel(doodlerId: string) {
    const doodlerModel = this._doodlers.get(doodlerId);
    if (!doodlerModel) throw new DoodleServerError('Doodler not found!');
    return doodlerModel;
  }
}

const DoodlerServiceInstance = new DoodlerService();
export default DoodlerServiceInstance;
