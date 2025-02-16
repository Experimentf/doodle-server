import DoodlerServiceInstance from '@/services/doodler';

import { DoodlerControllerInterface } from './interface';

class DoodlerController implements DoodlerControllerInterface {
  /**
   * Handle when the user request their info
   * @param respond - Respond to the client
   * @returns
   */
  public handleDoodlerOnGet: DoodlerControllerInterface['handleDoodlerOnGet'] =
    (socket) => async (_payload, respond) => {
      const data = await DoodlerServiceInstance.findDooder(socket.id);
      const { doodler } = data;
      respond({ data: doodler });
    };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: DoodlerControllerInterface['handleDoodlerOnSet'] =
    (socket) => async (payload, respond) => {
      const doodler = payload;
      const data = await DoodlerServiceInstance.addDoodler({
        id: socket.id,
        ...doodler
      });
      respond({ data: { id: data.doodlerId } });
    };
}

export default DoodlerController;
