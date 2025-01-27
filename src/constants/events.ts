/* 
- Prepend "ON_" for events that are received by the server
- Prepend "EMIT_" for events that are emitted by the server 
*/

export enum SocketEvents {
  ON_DISCONNECTING = 'disconnecting',
  ON_DISCONNECT = 'disconnect'
}

export enum RoomEvents {
  ON_ADD_DOODLER_TO_PUBLIC_ROOM = 'add-doodler-to-public-room',
  ON_ADD_DOODLER_TO_PRIVATE_ROOM = 'add-doodler-to-private-room',
  ON_CREATE_PRIVATE_ROOM = 'create-private-room',
  EMIT_DOODLER_JOIN = 'doodler-join',
  EMIT_DOODLER_LEAVE = 'doodler-leave'
}

export enum DoodlerEvents {
  ON_GET_DOODLER = 'get-doodler',
  ON_SET_DOODLER = 'set-doodler'
}

export enum GameEvents {
  ON_GET_GAME_DETAILS = 'get-game-details',
  EMIT_GAME_START = 'game-start',
  EMIT_GAME_LOBBY = 'game-lobby',
  EMIT_GAME_END = 'game-end'
}
