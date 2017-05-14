import makeAutomata from '../src/core/Automata';
import { automata1 as sample } from '../samples/Deterministic';

const { states, alphabet, transitions, initial, finals } = sample;

test('It makes a correct finite automata', () => {
  expect(makeAutomata(states, alphabet, transitions, initial, finals)).toEqual({
    states: states,
    alphabet: alphabet,
    transitions: transitions,
    initial: initial,
    finals: finals
  });
});

test('It dont create automata with invalid states', () => {
  const invalidStates = ['q0', 20];

  expect(makeAutomata(invalidStates, alphabet, transitions, initial, finals)).toEqual({});
});

test('It dont create automata with invalid alphabet', () => {
  const invalidAlphabet = ['a', 21, 'b'];

  expect(makeAutomata(states, invalidAlphabet, transitions, initial, finals)).toEqual({});
});

test('It dont create automata with invalid transitions', () => {
  const invalidTransisitions = [{
    state: 'q0',
    value: 20,
    next: 'q0',
  }];

  expect(makeAutomata(states, alphabet, invalidTransisitions, initial, finals)).toEqual({});
});

test('It dont create automata with invalid initial', () => {
  const invalidInitial= 20;

  expect(makeAutomata(states, alphabet, transitions, invalidInitial, finals)).toEqual({});
});

test('It dont create automata with invalid finals', () => {
  const invalidFinals = ['q0', {}];

  expect(makeAutomata(states, alphabet, transitions, initial, invalidFinals)).toEqual({});
});
