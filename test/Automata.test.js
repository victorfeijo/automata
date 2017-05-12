import { makeAutomata } from '../src/core/Automata.js';

const alphabet = new Set(['a', 'b']);
const q0 = { 'a': 'q0', 'b': 'q1' };
const q1 = { 'a': 'q1', 'b': 'q2' };
const q2 = { 'a': 'q0', 'b': 'q2' };
const states = new Set([q0, q1, q2]);
const initial = q0;
const finals = new Set([q2]);

test('It makes a correct finite automata', () => {
  expect(makeAutomata(alphabet, states, initial, finals)).toEqual({
    alphabet: alphabet,
    states: states,
    initial: initial,
    finals: finals
  });
});

test('It dont create automata with empty alphabet', () => {
  expect(makeAutomata({}, states, initial, finals)).toEqual({});
});

test('It dont create automata with empty states', () => {
  expect(makeAutomata(alphabet, {}, initial, finals)).toEqual({});
});

test('It dont create automata with null initial', () => {
  expect(makeAutomata(alphabet, states, null, finals)).toEqual({});
});

test('It dont create automata with empty finals', () => {
  expect(makeAutomata(alphabet, states, initial, {})).toEqual({});
});
