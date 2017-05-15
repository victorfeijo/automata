import { readTape } from '../src/core/Operations';
import { automata1, automata2 } from '../samples/Deterministic';
import { tape1, tape2, tape3 } from '../samples/Tapes';

describe('Read tape', () => {
  test('Full state automata - Read and accept tape', () => {
    expect(readTape(automata1, tape1)).toBe(true);
  });

  test('Full state automata - Read and reject tape', () => {
    expect(readTape(automata1, tape2)).toBe(false);
  });

  test('Error state automata - Read and reject tape', () => {
    expect(readTape(automata2, tape3)).toBe(true);
  });

  test('Error state automata - Read and reject tape', () => {
    expect(readTape(automata2, tape2)).toBe(false);
  });
});
