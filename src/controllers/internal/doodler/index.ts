import DoodlerServiceInstance from '@/services/doodler/DoodlerService';

import { DoodlerControllerInterface } from './interface';

class DoodlerController implements DoodlerControllerInterface {
  /**
   * Handle when the user request their info
   * @param respond - Respond to the client
   * @returns
   */
  public handleDoodlerOnGet: DoodlerControllerInterface['handleDoodlerOnGet'] =
    (socket) => async (_payload, respond) => {
      const doodler = await DoodlerServiceInstance.findDooder(socket.id);
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
      const addedDoodler = await DoodlerServiceInstance.addDoodler({
        id: socket.id,
        ...doodler
      });
      respond({ data: { id: addedDoodler.id } });
    };
}

export default DoodlerController;
