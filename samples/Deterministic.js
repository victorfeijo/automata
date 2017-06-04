import makeAutomata from '../src/core/specs/Automata.js';

export const d_automata1 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q0']
  }, {
    state: 'q0', value: 'b', next: ['q1']
  }, {
    state: 'q1', value: 'a', next: ['q1']
  }, {
    state: 'q1', value: 'b', next: ['q2']
  }, {
    state: 'q2', value: 'a', next: ['q0']
  }, {
    state: 'q2', value: 'b', next: ['q2']
  }],
  'q0',
  ['q2']
);

// L(A) = { (aa|bb)x | x E (a,b)* }
export const d_automata2 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q2']
  }, {
    state: 'q1', value: 'a', next: ['q3']
  }, {
    state: 'q2', value: 'b', next: ['q3']
  }, {
    state: 'q3', value: 'a', next: ['q3']
  }, {
    state: 'q3', value: 'b', next: ['q3']
  }],
  'q0',
  ['q3']
);

// L(A) = { x | x E (a,b)* and #a's are odd }
// NOT MINIMIZED
export const d_automata3 = makeAutomata(
  ['q0', 'q1', 'q2', 'q0q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q0']
  }, {
    state: 'q1', value: 'a', next: ['q0q2']
  }, {
    state: 'q1', value: 'b', next: ['q1']
  }, {
    state: 'q2', value: 'a', next: ['q1']
  }, {
    state: 'q0q2', value: 'a', next: ['q1']
  }, {
    state: 'q0q2', value: 'b', next: ['q0']
  }],
  'q0',
  ['q1']
);

// L(A) = { x | x E (a,b,c)* and #a's are even }
// NOT MINIMIZED
export const d_automata4 = makeAutomata(
  ['S', 'A', 'B', 'C', 'F', 'BF', 'SF', 'BSF', 'AC'],
  ['a', 'b', 'c'],
  [{
    state: 'S', value: 'a', next: ['A']
  }, {
    state: 'S', value: 'b', next: ['BF']
  }, {
    state: 'S', value: 'c', next: ['SF']
  }, {
    state: 'A', value: 'a', next: ['SF']
  }, {
    state: 'A', value: 'b', next: ['C']
  }, {
    state: 'A', value: 'c', next: ['A']
  }, {
    state: 'B', value: 'a', next: ['A']
  }, {
    state: 'B', value: 'c', next: ['BSF']
  }, {
    state: 'C', value: 'a', next: ['SF']
  }, {
    state: 'C', value: 'c', next: ['AC']
  }, {
    state: 'BF', value: 'a', next: ['A']
  }, {
    state: 'BF', value: 'c', next: ['BSF']
  }, {
    state: 'SF', value: 'a', next: ['A']
  }, {
    state: 'SF', value: 'b', next: ['BF']
  }, {
    state: 'SF', value: 'c', next: ['SF']
  }, {
    state: 'BSF', value: 'a', next: ['A']
  }, {
    state: 'BSF', value: 'b', next: ['BF']
  }, {
    state: 'BSF', value: 'c', next: ['BSF']
  }, {
    state: 'AC', value: 'a', next: ['SF']
  }, {
    state: 'AC', value: 'b', next: ['C']
  }, {
    state: 'AC', value: 'c', next: ['AC']
  }],
  'S',
  ['S', 'F', 'BF', 'SF', 'BSF']
);

// L(A) = { x | x E a(ba)* }
// NOT MINIMIZED
export const d_automata5 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q0']
  }, {
    state: 'q2', value: 'a', next: ['q3']
  }, {
    state: 'q3', value: 'a', next: ['q2']
  }, {
    state: 'q3', value: 'b', next: ['q2']
  }],
  'q0',
  ['q1']
);

// L(A) = ??
// NOT MINIMIZED ->> TEST CASE TO REMOVE DEAD STATES
export const d_automata6 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q3']
  }, {
    state: 'q1', value: 'a', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q0']
  }, {
    state: 'q2', value: 'b', next: ['q2']
  }, {
    state: 'q3', value: 'b', next: ['q3']
  }, {
    state: 'q4', value: 'a', next: ['q4']
  }, {
    state: 'q4', value: 'b', next: ['q5']
  }, {
    state: 'q5', value: 'b', next: ['q5']
  }],
  'q0',
  ['q0', 'q2', 'q3']
);

// L(A) = { x | x E (a,b)* and #b are ÷ 3 }
// NOT MINIMIZED -->> TEST CASE FOR EQUIVALENT STATES
export const d_automata7 = makeAutomata(
  ['A', 'B', 'C', 'E', 'F', 'G'],
  ['a', 'b'],
  [{
    state: 'A', value: 'a', next: ['G']
  }, {
    state: 'A', value: 'b', next: ['B']
  }, {
    state: 'B', value: 'a', next: ['F']
  }, {
    state: 'B', value: 'b', next: ['E']
  }, {
    state: 'C', value: 'a', next: ['C']
  }, {
    state: 'C', value: 'b', next: ['G']
  }, {
    state: 'E', value: 'a', next: ['E']
  }, {
    state: 'E', value: 'b', next: ['A']
  }, {
    state: 'F', value: 'a', next: ['B']
  }, {
    state: 'F', value: 'b', next: ['C']
  }, {
    state: 'G', value: 'a', next: ['G']
  }, {
    state: 'G', value: 'b', next: ['F']
  }],
  'A',
  ['A', 'G']
);
