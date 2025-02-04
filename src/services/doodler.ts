import { DoodlerModel } from '@/models/Doodler';
import { ServiceResponse } from '@/types/service';
import { ErrorFromServer } from '@/utils/error';
import { ErrorResponse, SuccessResponse } from '@/utils/service';

interface DoodlerServiceInterface {
  addDoodler: (doodler: {
    id: string;
    name: string;
    avatar: object;
  }) => ServiceResponse<{ doodlerId: string }>;
  removeDoodler: (doodlerId: string) => ServiceResponse<boolean>;
  findDooder: (doodlerId: string) => ServiceResponse<{ doodler: DoodlerModel }>;
  getDoodlers: (doodlerIds: string[]) => ServiceResponse<DoodlerModel[]>;
}

class DoodlerService implements DoodlerServiceInterface {
  public readonly doodlers: Map<string, DoodlerModel> = new Map<
    string,
    DoodlerModel
  >();

  /**
   * Add a doodler to the list of doodlers
   * @param doodlerProps Properties to be set for the new doodler
   * @returns New Doodler's ID
   */
  public addDoodler(doodlerProps: {
    id: string;
    name: string;
    avatar: object;
  }) {
    const { id, name, avatar } = doodlerProps;
    const doodler = new DoodlerModel(id, name, avatar);
    this.doodlers.set(id, doodler);
    return SuccessResponse({ doodlerId: doodler.id });
  }

  /**
   *
   * @param doodlerId Doddler's id that needs to be removed
   * @returns true | false
   */
  public removeDoodler(doodlerId: string) {
    return SuccessResponse(this.doodlers.delete(doodlerId));
  }

  /**
   * Find a doodler via id
   * @param doodlerId Doodler's id that needs to be found
   * @returns Doodler
   */
  public findDooder(doodlerId: string) {
    const doodler = this.doodlers.get(doodlerId);
    if (!doodler)
      return ErrorResponse(new ErrorFromServer('Doodler not found!'));
    return SuccessResponse({ doodler });
  }

  /**
   * Get all doodlers by doodler ids
   * @param doodlerIds Doodler IDs for which doodlers are requested
   * @returns - Array of Doodlers
   */
  public getDoodlers(doodlerIds: string[]) {
    const resultLength = doodlerIds.length;
    const doodlers = [];
    for (let i = 0; i < resultLength; i++) {
      const id = doodlerIds[i];
      const { data, error } = this.findDooder(id);
      if (error || data === undefined) break;
      doodlers.push(data.doodler);
    }
    if (doodlers.length !== resultLength)
      return ErrorResponse(new ErrorFromServer());
    return SuccessResponse(doodlers);
  }
}

const DoodlerServiceInstance = new DoodlerService();
export default DoodlerServiceInstance;
