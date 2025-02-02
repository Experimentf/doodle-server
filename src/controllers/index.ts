import DoodlerController from './internal/doodler';
import GameController from './internal/game';
import RoomController from './internal/room';
import SocketController from './internal/socket';
import {
  DoodlerControllerInterface,
  GameControllerInterface,
  RoomControllerInterface,
  SocketControllerInterface
} from './internal/types';

export type ControllerInterface = SocketControllerInterface &
  DoodlerControllerInterface &
  RoomControllerInterface &
  GameControllerInterface;
/**
 * A delegator controller that delegates the control to sub-controllers
 * depending on the accessed handler
 */
class Controller {
  private socketController = new SocketController();
  private doodlerController = new DoodlerController();
  private roomController = new RoomController();
  private gameController = new GameController();

  constructor() {
    return new Proxy(this, {
      get: (target, prop: keyof ControllerInterface) => {
        if (prop in target) return target[prop as keyof typeof target];
        for (const ctrl of [
          this.socketController,
          this.doodlerController,
          this.roomController,
          this.gameController
        ]) {
          if (prop in ctrl) {
            const property = ctrl[prop as keyof typeof ctrl];
            if (typeof property === 'function')
              return (
                property as ControllerInterface[keyof ControllerInterface]
              ).bind(ctrl);
            return property;
          }
        }
        return undefined;
      }
    }) as unknown as Controller & ControllerInterface;
  }
}

export default Controller;
