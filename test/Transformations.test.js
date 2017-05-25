import { d_automata2,
         d_automata3,
         d_automata4,
         d_automata5,
         d_automata6 } from '../samples/Deterministic';
import { nd_automata1 } from '../samples/NonDeterministic';
import { determineze, removeStates, removeUnreachables, removeDeads } from '../src/core/Transformations';
import makeAutomata from '../src/core/Automata';

describe('Transform NDAF to DAF', () => {
  // test('Already is deterministic', () => {
  //   expect(determineze(d_automata3)).toEqual(d_automata3);
  // });

  // test('Valid transformation', () => {
  //   expect(determineze(nd_automata1)).toEqual(d_automata3);
  // });
});

describe('Remove states', () => {
  test('It dont remove initial state', () => {
    expect(removeStates(d_automata3, ['q0'])).toEqual(d_automata3);
  });

  test('It remove state list', () => {
    const expected = makeAutomata(
      ['q0', 'q1'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }],
      'q0',
      ['q1']
    );

    expect(removeStates(d_automata3, ['q2', 'q0q2'])).toEqual(expected);
  });
});

describe('Remove unreachables states', () => {
  test('It remove one unreachable state', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q0q2'],
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
        state: 'q0q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q2', value: 'b', next: ['q0']
      }],
      'q0',
      ['q1']
    );

    expect(removeUnreachables(d_automata3)).toEqual(expected);
  });

  test('It remove unreachable states', () => {
    const reachable = removeUnreachables(d_automata4);

    expect(reachable.states).toEqual([ 'S', 'A', 'C', 'BF', 'SF', 'BSF', 'AC' ]);
    expect(reachable.finals).toEqual([ 'S', 'BF', 'SF', 'BSF' ]);
  });

  test('It dont remove any states', () => {
    expect(removeUnreachables(d_automata2)).toEqual(d_automata2);
  });
});

describe('Remove dead states', () => {
  test('It remove all deads state - single final state', () => {
    const expected = makeAutomata(
      [ 'q0', 'q1' ],
      [ 'a', 'b' ],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q1', value: 'b', next: ['q0']
      }],
      'q0',
      ['q1']
    );

    expect(removeDeads(d_automata5)).toEqual(expected);
  });

  test('It remove all deads state - multiple final state', () => {
    const expected = makeAutomata(
      [ 'q0', 'q1', 'q2', 'q3'],
      [ 'a', 'b' ],
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
      }],
      'q0',
      ['q0', 'q2', 'q3']
    );

    expect(removeDeads(d_automata6)).toEqual(expected);
  });

  test('It dont remove any state', () => {
    expect(removeDeads(d_automata2)).toEqual(d_automata2);
  });
});
