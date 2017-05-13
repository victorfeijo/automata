import makeAutomata from '../src/core/Automata.js';

export const automata1 = makeAutomata(
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
