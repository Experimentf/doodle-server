export enum GameCustomEvent {
  START_IF_VALID = 'start_if_valid'
}

export type GameCustomEventHandlerMap = {
  [GameCustomEvent.START_IF_VALID]: (gameId: string) => void;
};
