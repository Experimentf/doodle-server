/* 
- Prepend "ON_" for events that are received by the server
- Prepend "EMIT_" for events that are emitted by the server 
*/

export enum SocketEvents {
  ON_DISCONNECTING = 'disconnecting',
  ON_DISCONNECT = 'disconnect',
  ON_ERROR = 'error'
}

export enum RoomSocketEvents {
  ON_ADD_DOODLER_TO_PUBLIC_ROOM = 'add-doodler-to-public-room',
  ON_ADD_DOODLER_TO_PRIVATE_ROOM = 'add-doodler-to-private-room',
  ON_CREATE_PRIVATE_ROOM = 'create-private-room',
  ON_GET_ROOM = 'get-room',
  EMIT_DOODLER_JOIN = 'doodler-join',
  EMIT_DOODLER_LEAVE = 'doodler-leave'
}

export enum DoodlerSocketEvents {
  ON_GET_DOODLER = 'get-doodler',
  ON_SET_DOODLER = 'set-doodler'
}

export enum GameSocketEvents {
  ON_GET_GAME = 'get-game',
  ON_GAME_CANVAS_OPERATION = 'game-canvas-operation',
  ON_GAME_CHOOSE_WORD = 'game-choose-word',
  ON_GAME_HUNCH = 'game-hunch',
  EMIT_GAME_STATUS_UPDATED = 'game-status-updated',
  EMIT_GAME_CANVAS_OPERATION = 'game-canvas-operation',
  EMIT_GAME_HUNCH = 'game-hunch'
}
