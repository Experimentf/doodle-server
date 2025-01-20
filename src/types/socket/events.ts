/* 
- Prepend "ON_" for events that are received by the server
- Prepend "EMIT_" for events that are emitted by the server 
*/

export enum SocketEvents {
  ON_DISCONNECTING = 'disconnecting',
  ON_DISCONNECT = 'disconnect'
}

export enum RoomEvents {
  EMIT_NEW_USER = 'new-user',
  EMIT_USER_LEAVE = 'user-leave'
}

export enum DoodlerEvents {
  ON_GET = 'get-user',
  ON_SET = 'set-user'
}

export enum GameEvents {
  ON_PLAY_PUBLIC_GAME = 'play-public-game',
  ON_GET_GAME_DETAILS = 'get-game-details',
  EMIT_GAME_START = 'game-start',
  EMIT_GAME_LOBBY = 'game-lobby',
  EMIT_GAME_END = 'game-end'
}
