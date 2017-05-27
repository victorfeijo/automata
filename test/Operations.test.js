import { readTape, transitiveTransitions, removeFromNext, previousStates } from '../src/core/Operations';
import { d_automata1, d_automata2, d_automata5 } from '../samples/Deterministic';
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
