import { readTape, transitiveTransitions } from '../src/core/Operations';
import { d_automata1, d_automata2 } from '../samples/Deterministic';
import { nd_automata1, nd_automata3 } from '../samples/NonDeterministic';
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

describe('Transitive transitions', () => {
  test('Transitive on deterministic automata', () => {
    const { initial, transitions } = d_automata2;

    expect(transitiveTransitions(initial, transitions)).toEqual(['q0', 'q1', 'q3', 'q2'])
    expect(transitiveTransitions('q1', transitions)).toEqual(['q1', 'q3'])
  })

  test('Transitive on non deterministic automata', () => {
    const { initial, transitions } = nd_automata3;

    expect(transitiveTransitions(initial, transitions)).toEqual(['q0', 'q1', 'q2'])
    expect(transitiveTransitions('q1', transitions)).toEqual(['q1'])
  })
});
