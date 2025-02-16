import { DoodlerModel } from '@/models/DoodlerModel';
import { DoodlerInterface } from '@/types/socket/doodler';
import { ErrorFromServer } from '@/utils/error';

interface DoodlerServiceInterface {
  addDoodler: (doodler: {
    id: string;
    name: string;
    avatar: object;
  }) => Promise<{
    doodlerId: string;
  }>;
  removeDoodler: (doodlerId: string) => Promise<boolean>;
  findDooder: (doodlerId: string) => Promise<{ doodler: DoodlerInterface }>;
  getDoodlers: (doodlerIds: string[]) => Promise<DoodlerInterface[]>;
}

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
    const doodler = new DoodlerModel(id, name, avatar);
    this._doodlers.set(id, doodler);
    return { doodlerId: doodler.id };
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
    const doodler = this._doodlers.get(doodlerId);
    if (!doodler) throw new ErrorFromServer('Doodler not found!');
    return { doodler: doodler.json };
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
        const { doodler } = await this.findDooder(id);
        return doodler;
      })
    );
    if (doodlers.length !== resultLength) throw new ErrorFromServer();
    return doodlers;
  }
}

const DoodlerServiceInstance = new DoodlerService();
export default DoodlerServiceInstance;
