import { readTape, transitiveTransitions, removeFromNext, previousStates, equivalentStates, reduceEquivalents, withErrorTransitions } from '../src/core/Operations';
import { removeUnreachables } from '../src/core/Transformations';
import { d_automata1, d_automata2, d_automata4, d_automata7, d_automata5 } from '../samples/Deterministic';
import { nd_automata1, nd_automata3 } from '../samples/NonDeterministic';
import { tape1, tape2, tape3 } from '../samples/Tapes';
import { difference, contains } from 'ramda';
import ENUM from '../src/core/Enum'

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

    expect(transitiveTransitions(initial, transitions)).toEqual(['q0', 'q1', 'q3', 'q2']);
    expect(transitiveTransitions('q1', transitions)).toEqual(['q1', 'q3']);
  });

  test('Transitive on non deterministic automata', () => {
    const { initial, transitions } = nd_automata3;

    expect(transitiveTransitions(initial, transitions)).toEqual(['q0', 'q1', 'q2']);
    expect(transitiveTransitions('q1', transitions)).toEqual(['q1']);
  })
});

describe('Remove state from next', () => {
  test('Remove q1 on deterministic automata', () => {
    const { transitions, initial } = d_automata2;

    expect(removeFromNext('q3', transitions)).toEqual([
      { state: 'q0', value: 'a', next: [ 'q1' ] },
      { state: 'q0', value: 'b', next: [ 'q2' ] },
    ]);
  })

  test('Transitive on non deterministic automata', () => {
    const { transitions, initial } = nd_automata1;

    expect(removeFromNext(initial, transitions)).toEqual([
      { state: 'q0', value: 'a', next: [ 'q1' ] },
      { state: 'q1', value: 'a', next: [ 'q2' ] },
      { state: 'q1', value: 'b', next: [ 'q1' ] },
      { state: 'q2', value: 'a', next: [ 'q1' ] },
    ]);
  })
});

describe('Previous transitions', () => {
  test('All transitions previous from final', () => {
    const { states, transitions, finals } = d_automata2;

    expect(previousStates(finals[0], transitions).sort()).toEqual(states.sort());
  });

  test('Just some transitions previous from final', () => {
    const { transitions, finals } = d_automata5;

    expect(previousStates(finals[0], transitions)).toEqual(['q1', 'q0']);
  });
});

describe('Equivalent states', () => {
  test('Equivalence test on d_automata7', () => {
    const { states, transitions, finals } = d_automata7;
    const equivalents = [finals, difference(states, finals)];

    expect(equivalentStates(d_automata7, equivalents, 'A', 'G')).toBeTruthy();
    expect(equivalentStates(d_automata7, equivalents, 'B', 'F')).toBeTruthy();
    expect(equivalentStates(d_automata7, equivalents, 'C', 'E')).toBeTruthy();
    expect(equivalentStates(d_automata7, equivalents, 'G', 'A')).toBeTruthy();

    expect(equivalentStates(d_automata7, equivalents, 'B', 'C')).toBeFalsy();
    expect(equivalentStates(d_automata7, equivalents, 'A', 'F')).toBeFalsy();
    expect(equivalentStates(d_automata7, equivalents, 'G', 'B')).toBeFalsy();
  });

  test('Equivalence tes on d_automata5 - with error transitions', () => {
    const { states, transitions, finals } = d_automata5;
    const equivalents = [finals, difference(states, finals)];

    expect(equivalentStates(d_automata5, equivalents, 'q0', 'q0')).toBeTruthy();
    expect(equivalentStates(d_automata5, equivalents, 'q2', 'q2')).toBeTruthy();

    expect(equivalentStates(d_automata5, equivalents, 'q1', 'q2')).toBeFalsy();
    expect(equivalentStates(d_automata5, equivalents, 'q0', 'q1')).toBeFalsy();
  });
});

describe('Equivalent states', () => {
  test('Reduce equivalents on d_automata7', () => {
    const { states, finals } = d_automata7;
    const equivalents = [difference(states, finals), finals];

    expect(reduceEquivalents(d_automata7, equivalents)).toEqual(
      [['B', 'F'], ['C', 'E'], ['A', 'G']]
    );
  });

  test('Reduce equivalents on d_automata5', () => {
    const { states, finals } = d_automata5;
    const equivalents = [difference(states, finals), finals];

    expect(reduceEquivalents(d_automata5, equivalents)).toEqual(
      [['q0'], ['q2'], ['q3'], ['q1']]
    );
  });

  test('Reduce equivalents on d_automata4', () => {
    const minimized = removeUnreachables(d_automata4);
    const { states, finals } = minimized;
    const equivalents = [difference(states, finals), finals];

    expect(reduceEquivalents(minimized, equivalents)).toEqual(
      [['A', 'AC'], ['C'], ['S', 'SF', 'BSF'], ['BF']]
    );
  });
});

describe('With error transitions', () => {
  test('Return transitions with error from d_automata1', () => {
    const withError = withErrorTransitions(d_automata2);

    expect(contains(
      { state: 'q1', value: 'b', next: [ENUM.Error] }, withError
    )).toBeTruthy();
    expect(contains(
      { state: 'q2', value: 'a', next: [ENUM.Error] }, withError
    )).toBeTruthy();
  });
});
