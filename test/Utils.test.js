import { d_automata1,
         d_automata2,
         d_automata3,
         d_automata4,
         d_automata5,
         d_automata6,
         d_automata7,
         d_automata8} from '../samples/Deterministic';
import {nd_automata53} from '../samples/NonDeterministic'
import makeAutomata from '../src/core/specs/Automata';
import {renameStates} from '../src/core/Utils';



describe('Rename states of automata', () => {
  test('Rename State Deterministic Automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q2']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q2', value: 'b', next: ['q2']
      }, {
        state: 'q3', value: 'a', next: ['q2']
      }, {
        state: 'q1', value: 'a', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q0']
      }],
      'q0',
      ['q2']
    );
    expect(renameStates(d_automata3)).toEqual(expected);
  });
  test('Rename a automata with only one state', () => {
    const expected = makeAutomata(
      ['q0'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q0']
      }],
      'q0',
      ['q0']
    );
    expect(renameStates(d_automata8)).toEqual(expected);
  });
  test('Rename states of a Non-deterministic automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3','q4', 'q5'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1', 'q3', 'q5']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q3', value: 'b', next: ['q3']
      }, {
        state: 'q4', value: 'a', next: ['q3']
      }, {
        state: 'q5', value: 'a', next: ['q5']
      }, {
        state: 'q5', value: 'b', next: ['q4']
      }, {
        state: 'q1', value: 'a', next: ['q4']
      }, {
        state: 'q2', value: 'a', next: ['q0', 'q3', 'q4']
      }, {
        state: 'q2', value: 'b', next: ['q0', 'q3', 'q5']
      }, {
        state: 'q3', value: 'a', next: ['q2']
      }],
      'q0',
      ['q3', 'q1', 'q2']
    );
    expect(renameStates(nd_automata53)).toEqual(expected);
  });
  test('Rename states of Letters Deterministic Automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q4', 'q5'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q5']
      }, {
        state: 'q0', value: 'b', next: ['q1']
      }, {
        state: 'q1', value: 'a', next: ['q4']
      }, {
        state: 'q1', value: 'b', next: ['q3']
      }, {
        state: 'q2', value: 'a', next: ['q2']
      }, {
        state: 'q2', value: 'b', next: ['q5']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q0']
      }, {
        state: 'q4', value: 'a', next: ['q1']
      }, {
        state: 'q4', value: 'b', next: ['q2']
      }, {
        state: 'q5', value: 'a', next: ['q5']
      }, {
        state: 'q5', value: 'b', next: ['q4']
      }],
      'q0',
      ['q0', 'q5']
    );
    expect(renameStates(d_automata7)).toEqual(expected);
  });
  test('Rename states of Letters Deterministic Automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'],
      ['a', 'b', 'c'],
      [{
        state: 'q7', value: 'a', next: ['q0']
      }, {
        state: 'q7', value: 'b', next: ['q3']
      }, {
        state: 'q7', value: 'c', next: ['q8']
      }, {
        state: 'q0', value: 'a', next: ['q8']
      }, {
        state: 'q0', value: 'b', next: ['q5']
      }, {
        state: 'q0', value: 'c', next: ['q0']
      }, {
        state: 'q2', value: 'a', next: ['q0']
      }, {
        state: 'q2', value: 'c', next: ['q4']
      }, {
        state: 'q5', value: 'a', next: ['q8']
      }, {
        state: 'q5', value: 'c', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q0']
      }, {
        state: 'q3', value: 'c', next: ['q4']
      }, {
        state: 'q8', value: 'a', next: ['q0']
      }, {
        state: 'q8', value: 'b', next: ['q3']
      }, {
        state: 'q8', value: 'c', next: ['q8']
      }, {
        state: 'q4', value: 'a', next: ['q0']
      }, {
        state: 'q4', value: 'b', next: ['q3']
      }, {
        state: 'q4', value: 'c', next: ['q4']
      }, {
        state: 'q1', value: 'a', next: ['q8']
      }, {
        state: 'q1', value: 'b', next: ['q5']
      }, {
        state: 'q1', value: 'c', next: ['q1']
      }],
      'q7',
      ['q7', 'q6', 'q3', 'q8', 'q4']
    );
    expect(renameStates(d_automata4)).toEqual(expected);
  });
});

