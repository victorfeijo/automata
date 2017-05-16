import makeAutomata, { isNonDeterministic } from '../src/core/Automata';
import { d_automata1, d_automata2 } from '../samples/Deterministic';
import { nd_automata1 } from '../samples/NonDeterministic';

describe('Automata validation and creation', () => {
  const { states, alphabet, transitions, initial, finals } = d_automata1;

  test('It makes a correct deterministic automata', () => {
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
});

describe('Verify automata is deterministic', () => {
  test('Automata is deterministic', () => {
    expect(isNonDeterministic(d_automata1)).toBe(false);

    expect(isNonDeterministic(d_automata2)).toBe(false);
  });

  test('Automata is non deterministic', () => {
    expect(isNonDeterministic(nd_automata1)).toBe(true);
  });
});
