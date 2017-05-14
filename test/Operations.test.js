import { acceptTape } from '../src/core/Operations';
import { automata1 as automata } from '../samples/Deterministic';
import { tape1, tape2 } from '../samples/Tapes';

test('It dont accept a tape', () => {
  expect(acceptTape(automata, tape1)).toBe(true);
});

test('It dont accept a tape', () => {
  expect(acceptTape(automata, tape2)).toBe(false);
});
