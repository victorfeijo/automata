import { d_automata1,
         d_automata2,
         d_automata3,
         d_automata4,
         d_automata5,
         d_automata6,
         d_automata7 } from '../samples/Deterministic';
import { distinguishStates, minimize, determineze, removeStates, removeUnreachables, removeDeads, createDetTransition, removeEquivalent, removeBlankTransitions } from '../src/core/Transformations';
import { readTape } from '../src/core/Operations';
import { nd_automata1, nd_automata3, nd_automata4, nd_automata5, nd_automata51, nd_automata52, nd_automata6, nd_automata7, nd_automata8, nd_automata9} from '../samples/NonDeterministic';
import makeAutomata from '../src/core/Automata';
import makeTape from '../src/core/Tape';

describe('Transform NDAF to DAF', () => {
  test('Update State and Transition with 2 next', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q0q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q2', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'a', next: ['q0q2']

      }],
      'q0',
      ['q1']
    );
    expect(createDetTransition(nd_automata1, {state: 'q1', value: 'a', next: ['q0', 'q2']})).toEqual(expected);
  });
  test('Update State and Transition with 3 next', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q0q1q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q1q2', value: 'a', next: ['q0', 'q1', 'q2']
      }, {
        state: 'q0q1q2', value: 'b', next: ['q0', 'q1']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q2']

      }],
      'q0',
      ['q1', 'q0q1q2']
    );
    expect(createDetTransition(nd_automata4, {state: 'q1', value: 'a', next: ['q0','q1', 'q2']})).toEqual(expected);
  });
  test('Update State and Transition with 3.1 next', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q0q1q3'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q2']
      }, {
        state: 'q0q1q3', value: 'a', next: ['q0', 'q1', 'q3']
      }, {
        state: 'q0q1q3', value: 'b', next: ['q0', 'q1', 'q2']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q3']
      }],
      'q0',
      ['q1', 'q0q1q3']
    );
    expect(createDetTransition(nd_automata5, {state: 'q1', value: 'a', next: ['q0','q1', 'q3']})).toEqual(expected);
  });
  test('Update State and Transition with 3.2 next', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q0q1q3'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q2']
      }, {
        state: 'q0q1q3', value: 'b', next: ['q0', 'q1', 'q2']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q3', value: 'a', next: ['q0q1q3']
      }],
      'q0',
      ['q1', 'q0q1q3']
    );
    expect(createDetTransition(nd_automata51, {state: 'q0q1q3', value: 'a', next: ['q0','q1', 'q3']})).toEqual(expected);
  });
  test('Update State and Transition with 3.3 next', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q0q1q3', 'q0q1q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q2']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q3', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q2', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q2', value: 'b', next: ['q0', 'q1']
      }, {
        state: 'q0q1q3', value: 'b', next: ['q0q1q2']
      }],
      'q0',
      ['q1', 'q0q1q3', 'q0q1q2']
    );
    expect(createDetTransition(nd_automata52, {state: 'q0q1q3', value: 'b', next: ['q0','q1','q2']})).toEqual(expected);
  })
  test('Determineze Simple Automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q0q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q2', value: 'a', next: ['q1']
      }, {
        state: 'q0q2', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'a', next: ['q0q2']

      }],
      'q0',
      ['q1']
    );
    expect(determineze(nd_automata1)).toEqual(expected);

  });
  test('Determineze Complex Automata', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q0q1q2', 'q0q1'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q2']
      }, {
        state: 'q0q1q2', value: 'a', next: ['q0q1q2']
      }, {
        state: 'q0q1', value: 'a', next: ['q0q1q2']
      }, {
        state: 'q0q1q2', value: 'b', next: ['q0q1']
      }, {
        state: 'q0q1', value: 'b', next: ['q0q1']
      }],
      'q0',
      ['q1', 'q0q1q2', 'q0q1']
    );
    expect(determineze(nd_automata4)).toEqual(expected);
  });
  test('Determineze Complex Automata 2.0', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q0q1q3', 'q0q1q2', 'q0q1'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q2']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q3', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q2', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q3', value: 'b', next: ['q0q1q2']
      }, {
        state: 'q0q1', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q2', value: 'b', next: ['q0q1']
      }, {
        state: 'q0q1', value: 'b', next: ['q0q1']
      }],
      'q0',
      ['q1', 'q0q1q3', 'q0q1q2', 'q0q1']
    );
    expect(determineze(nd_automata51)).toEqual(expected);
  });


});

describe('Remove Blank Transitions', () => {
  test('Remove Blank of nd_automata3', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q2']
      }, {
        state: 'q0', value: 'b', next: ['q1']
      }],
      'q0',
      ['q1, q2']
    );
    // expect(removeBlankTransitions(nd_automata3)).toEqual(expected);
  });
  test('Remove Blank of nd_automata7', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q2']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q2', value: 'b', next: ['q2', 'q1']
      }],
      'q0',
      ['q2']
    );
    // const test = removeBlankTransitions(nd_automata7);
    // console.log(test);
    // console.log(test.transitions);
    // expect(removeBlankTransitions(nd_automata7)).toEqual(expected);
  });
  test('Remove Blank Transition to ERROR', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q2']
      }, {
       state: 'q2', value: 'b', next: ['q1']
      }],
     'q0',
     ['q2']
    );
    // expect(removeBlankTransitions(nd_automata8)).toEqual(expected);
  });
  test('Remove 2 blank transitions in a row', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2', 'q3'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q2']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q2', value: 'b', next: ['q2', 'q1']
      }, {
        state: 'q3', value: 'a', next: ['q1', 'q3']
      }, {
        state: 'q3', value: 'b', next: ['q2', 'q1']
      }],
      'q0',
      ['q2', 'q3']
    );
    const test = removeBlankTransitions(nd_automata9);

    expect(removeBlankTransitions(nd_automata9)).toEqual(expected);
  });
  test('Remove blank transition and modify finals', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q2']
      }, {
        state: 'q0', value: 'b', next: ['q1']
      }],
      'q0',
      ['q1', 'q2', 'q0']
    );
    expect(removeBlankTransitions(nd_automata3)).toEqual(expected);
  });
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

describe('Remove equivalent states from automata', () => {
  test('d_Automata7 has equivalent states', () => {
    const expected = makeAutomata(
      ['BF', 'CE', 'AG'],
      ['a', 'b'],
      [{ state: 'BF', value: 'a', next: ['BF'] },
       { state: 'BF', value: 'b', next: ['CE'] },
       { state: 'CE', value: 'a', next: ['CE'] },
       { state: 'CE', value: 'b', next: ['AG'] },
       { state: 'AG', value: 'a', next: ['AG'] },
       { state: 'AG', value: 'b', next: ['BF'] }],
      'AG',
      ['AG']
    );

    expect(removeEquivalent(d_automata7)).toEqual(expected);
  });

  test('d_Automata1 has no equivalent states', () => {
    expect(removeEquivalent(d_automata1)).toEqual(d_automata1);
  });
});

describe('Minimize automata', () => {
  test('Dont minimize NDFA', () => {
    expect(() => {
      minimize(nd_automata1);
    }).toThrowError('Automata should be deterministic to minimize.')
  });

  test('Read tape test d_automata1', () => {
    const tape1 = makeTape('abb');
    const tape2 = makeTape('abba');

    const minimized = minimize(d_automata1);

    expect(readTape(d_automata1, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata1, tape2)).toBeFalsy();
    expect(readTape(minimized, tape2)).toBeFalsy();
  });

  test('Read tape test d_automata2', () => {
    const tape1 = makeTape('aabba');
    const tape2 = makeTape('bbaaa');
    const tape3 = makeTape('abba');

    const minimized = minimize(d_automata2);

    expect(readTape(d_automata2, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata2, tape2)).toBeTruthy();
    expect(readTape(minimized, tape2)).toBeTruthy();

    expect(readTape(d_automata2, tape3)).toBeFalsy();
    expect(readTape(minimized, tape3)).toBeFalsy();
  });

  test('Read tape test d_automata3', () => {
    const tape1 = makeTape('abbabbabaa');
    const tape2 = makeTape('a');
    const tape3 = makeTape('abbba');

    const minimized = minimize(d_automata3);

    expect(readTape(d_automata3, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata3, tape2)).toBeTruthy();
    expect(readTape(minimized, tape2)).toBeTruthy();

    expect(readTape(d_automata3, tape3)).toBeFalsy();
    expect(readTape(minimized, tape3)).toBeFalsy();
  });

  test('Read tape test d_automata4', () => {
    const tape1 = makeTape('baba');
    const tape2 = makeTape('baccccbca');
    const tape3 = makeTape('aabbba');

    const minimized = minimize(d_automata4);

    expect(readTape(d_automata4, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata4, tape2)).toBeTruthy();
    expect(readTape(minimized, tape2)).toBeTruthy();

    expect(readTape(d_automata4, tape3)).toBeFalsy();
    expect(readTape(minimized, tape3)).toBeFalsy();
  });

  test('Read tape test d_automata5', () => {
    const tape1 = makeTape('abababa');
    const tape2 = makeTape('abaab');

    const minimized = minimize(d_automata5);

    expect(readTape(d_automata5, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata5, tape2)).toBeFalsy();
    expect(readTape(minimized, tape2)).toBeFalsy();
  });

  test('Read tape test d_automata6', () => {
    const tape1 = makeTape('abab');
    const tape2 = makeTape('baaaab');

    const minimized = minimize(d_automata6);

    expect(readTape(d_automata6, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata6, tape2)).toBeFalsy();
    expect(readTape(minimized, tape2)).toBeFalsy();
  });

  test('Read tape test d_automata7', () => {
    const tape1 = makeTape('aaaa');
    const tape2 = makeTape('abaabaaba');
    const tape3 = makeTape('abbaa');

    const minimized = minimize(d_automata7);

    expect(readTape(d_automata7, tape1)).toBeTruthy();
    expect(readTape(minimized, tape1)).toBeTruthy();

    expect(readTape(d_automata7, tape2)).toBeTruthy();
    expect(readTape(minimized, tape2)).toBeTruthy();

    expect(readTape(d_automata7, tape3)).toBeFalsy();
    expect(readTape(minimized, tape3)).toBeFalsy();
  });
});

describe('Distinguish states', () => {
  test('It adds A char to d_automata1', () => {
    const expected = makeAutomata(
      [ 'q0A', 'q1A', 'q2A' ],
      [ 'a', 'b' ],
      [ { state: 'q0A', value: 'a', next: [ 'q0A' ] },
        { state: 'q0A', value: 'b', next: [ 'q1A' ] },
        { state: 'q1A', value: 'a', next: [ 'q1A' ] },
        { state: 'q1A', value: 'b', next: [ 'q2A' ] },
        { state: 'q2A', value: 'a', next: [ 'q0A' ] },
        { state: 'q2A', value: 'b', next: [ 'q2A' ] } ],
      'q0A',
      [ 'q2A' ]
    );

    expect(distinguishStates(d_automata1, 'A')).toEqual(expected);
  });

  test('It adds A char to d_automata4', () => {
    const tape1 = makeTape('baba');
    const tape2 = makeTape('baccccbca');
    const tape3 = makeTape('aabbba');

    const distinguish = distinguishStates(d_automata4, 'A');

    expect(readTape(d_automata4, tape1)).toBeTruthy();
    expect(readTape(distinguish, tape1)).toBeTruthy();

    expect(readTape(d_automata4, tape2)).toBeTruthy();
    expect(readTape(distinguish, tape2)).toBeTruthy();

    expect(readTape(d_automata4, tape3)).toBeFalsy();
    expect(readTape(distinguish, tape3)).toBeFalsy();
  });
});
