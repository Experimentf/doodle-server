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
}

const DoodlerServiceInstance = new DoodlerService();
export default DoodlerServiceInstance;
