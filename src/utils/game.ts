import {
  GameInterface,
  HunchInterface,
  HunchStatus
} from '@/types/socket/game';

export const createHunch = (
  message: string,
  status: HunchStatus,
  senderId?: string
): HunchInterface => ({
  message,
  status,
  senderId,
  isSystemMessage: senderId === undefined
});

export const hideWord = (game: GameInterface): GameInterface => {
  const word = game.options.word;
  let hidddenWord = '';
  for (const ch of word) {
    if (ch !== ' ') hidddenWord += '_';
  }
  return {
    ...game,
    options: {
      ...game.options,
      word: hidddenWord
    }
  };
};
