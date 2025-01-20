import { customAlphabet } from 'nanoid';

const generator10 = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

export const generateId = () => {
  return generator10();
};
