import DoodlerServiceInstance from '@/services/doodler';
import { ClientToServerEvents, SocketType } from '@/types/socket';
import { DoodlerEvents } from '@/types/socket/events';

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
    (respond) => {
      if (!this.socket) return;
      const socket = this.socket;
      const { data, error } = DoodlerServiceInstance.findDooder(socket.id);
      if (error || !data) {
        respond(null, error);
        return;
      }
      const {
        doodler: { name }
      } = data;
      respond({ name });
    };

  /**
   * Handle when the client wants to set their info
   * @param doodler - Doodler information provided by the client
   * @returns
   */
  public handleDoodlerOnSet: ClientToServerEvents[DoodlerEvents.ON_SET_DOODLER] =
    (doodler) => {
      if (!this.socket) return;
      const socket = this.socket;
      DoodlerServiceInstance.addDoodler({ id: socket.id, ...doodler }); // TODO: Handle Error
    };
}

export default DoodlerController;
