import makeAutomata from '../src/core/Automata.js';

export const d_automata1 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0',
    value: 'a',
    next: ['q0'],
  }, {
    state: 'q0',
    value: 'b',
    next: ['q1'],
  }, {
    state: 'q1',
    value: 'a',
    next: ['q1'],
  }, {
    state: 'q1',
    value: 'b',
    next: ['q2'],
  }, {
    state: 'q2',
    value: 'a',
    next: ['q0'],
  }, {
    state: 'q2',
    value: 'b',
    next: ['q2'],
  }],
  'q0',
  ['q2']
);

// L(A) = { (aa|bb)x | x E (a,b)* }
export const d_automata2 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3'],
  ['a', 'b'],
  [{
    state: 'q0',
    value: 'a',
    next: ['q1'],
  }, {
    state: 'q0',
    value: 'b',
    next: ['q2'],
  }, {
    state: 'q1',
    value: 'a',
    next: ['q3'],
  }, {
    state: 'q2',
    value: 'b',
    next: ['q3'],
  }, {
    state: 'q3',
    value: 'a',
    next: ['q3'],
  }, {
    state: 'q3',
    value: 'b',
    next: ['q3'],
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
    state: 'q0',
    value: 'a',
    next: ['q1'],
  }, {
    state: 'q0',
    value: 'b',
    next: ['q0'],
  }, {
    state: 'q1',
    value: 'a',
    next: ['q0q2'],
  }, {
    state: 'q1',
    value: 'b',
    next: ['q1'],
  }, {
    state: 'q2',
    value: 'a',
    next: ['q1'],
  }, {
    state: 'q0q2',
    value: 'a',
    next: ['q1'],
  }, {
    state: 'q0q2',
    value: 'b',
    next: ['q0'],
  }],
  'q0',
  ['q1']
);
