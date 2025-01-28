import { DoodlerEvents } from '@/constants/events';
import DoodlerServiceInstance from '@/services/doodler';
import { ClientToServerEvents, SocketType } from '@/types/socket';

import { DoodlerControllerInterface } from './types';

class DoodlerController implements DoodlerControllerInterface {
  private socket?: SocketType;

  /**
   * Set the socket variable
   * @param socket
   */
  public setSocket(socket: SocketType) {
    this.socket = socket;
  }

  /**
   * Handle when the user request their info
   * @param respond - Respond to the client
   * @returns
   */
  public handleDoodlerOnGet: ClientToServerEvents[DoodlerEvents.ON_GET_DOODLER] =
    (_, respond) => {
      if (!this.socket) return;
      const socket = this.socket;
      const { data, error } = DoodlerServiceInstance.findDooder(socket.id);
      if (error || !data) {
        respond({ data: null, error });
        return;
      }
      const {
        doodler: { name }
      } = data;
      respond({ data: { name } });
    };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER] =
    (doodler, respond) => {
      if (!this.socket) return;
      const socket = this.socket;
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
