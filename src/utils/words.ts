import words from '@/constants/words.json';

export function fetchRandomWords(num = 3) {
  const result: Array<string> = [];
  for (let i = 0; i < num; i++) {
    const index = Math.floor(Math.random() * words.length);
    result.push(words[index][0] as string);
  }
  return result;
}
