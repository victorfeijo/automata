import { readTape } from '../src/core/Operations';
import { d_automata1, d_automata2 } from '../samples/Deterministic';
import { nd_automata1 } from '../samples/NonDeterministic';
import { tape1, tape2, tape3 } from '../samples/Tapes';

describe('Read tape', () => {
  test('Full state automata - Read and accept tape', () => {
    expect(readTape(d_automata1, tape1)).toBe(true);
  });

  test('Full state automata - Read and reject tape', () => {
    expect(readTape(d_automata1, tape2)).toBe(false);
  });

  test('Error state automata - Read and reject tape', () => {
    expect(readTape(d_automata2, tape3)).toBe(true);
  });

  test('Error state automata - Read and reject tape', () => {
    expect(readTape(d_automata2, tape2)).toBe(false);
  });

  test('Non deterministic automata - Read and reject tape', () => {
    expect(readTape(d_automata2, tape3)).toBe(true);
  });

  test('Non deterministic automata - Read and reject tape', () => {
    expect(readTape(d_automata2, tape2)).toBe(false);
  });
});
