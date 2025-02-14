import DoodlerServiceInstance from '@/services/doodler';

import { DoodlerControllerInterface } from './interface';

class DoodlerController implements DoodlerControllerInterface {
  /**
   * Handle when the user request their info
   * @param respond - Respond to the client
   * @returns
   */
  public handleDoodlerOnGet: DoodlerControllerInterface['handleDoodlerOnGet'] =
    (socket) => (_payload, respond) => {
      const { data, error } = DoodlerServiceInstance.findDooder(socket.id);
      if (error || !data) {
        respond({ data: null, error });
        return;
      }
      const { doodler } = data;
      respond({ data: doodler });
    };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: DoodlerControllerInterface['handleDoodlerOnSet'] =
    (socket) => (payload, respond) => {
      const doodler = payload;
      const { data, error } = DoodlerServiceInstance.addDoodler({
        id: socket.id,
        ...doodler
      });
      if (error || data === undefined) {
        respond({ data: null, error: error });
      }
      respond({ data: { id: data.doodlerId } });
    };
}

export default DoodlerController;
