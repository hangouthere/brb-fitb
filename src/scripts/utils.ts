// @ts-ignore
import { eng, removeStopwords, _123 } from 'stopword';

const REGEX_NUMBER = /[0-9]/g;
const REGEX_PUNCTUATION = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

const IGNORE_WORDS = ["it's", 'x'];

export type NormalizedEntry = {
  word: string;
  strippedWord: string;
  shouldIgnoreForGuess: boolean;
};

/**
 * Picks a random value from the entirety of the input array
 */
export const randomFromArray = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];

/**
 * Strips all punctuation from the input
 */
export const stripPunctuation = (input: string): string => input.replace(REGEX_PUNCTUATION, '');

/**
 * Evaluates whether the word should be ignored for guessing
 */
export const shouldIgnoreForGuess = (word: string): boolean =>
  !removeStopwords([word], [...eng, ..._123, ...IGNORE_WORDS]).length || REGEX_NUMBER.test(word);

/**
 * Turns a string of words into an array of Normalized Entries
 */
export const toNormalizedEntry = (words: string): NormalizedEntry[] => {
  return words.split(' ').map(word => ({
    word,
    shouldIgnoreForGuess: shouldIgnoreForGuess(word.toLowerCase()),
    strippedWord: stripPunctuation(word)
  }));
};
