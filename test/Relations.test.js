import { d_automata1,
         d_automata2,
         d_automata3,
         d_automata4,
         d_automata5,
         d_automata6,
         d_automata7,
         d_automata9,
         d_automata10} from '../samples/Deterministic';
import { nd_automata3 } from '../samples/NonDeterministic';
import { joinAutomatas,
         complementAutomata,
         intersectionAutomata,
         differenceAutomata,
         isEquivalent, isContained } from '../src/core/Relations';
import { readTape } from '../src/core/Operations';
import { minimize } from '../src/core/Transformations';
import makeTape from '../src/core/specs/Tape';
import makeAutomata from '../src/core/specs/Automata'
import { contains, pipe } from 'ramda';
import {renameStates} from '../src/core/Utils'
import { inspect } from 'util';
import {normalize, deDesimoneTree, deSimoneToAutomata} from '../src/core/RegularExpression';

describe('Union relation', () => {
  test('Join d_automata2 with d_automata3', () => {
    const tape1 = makeTape('aabbbab');
    const tape2 = makeTape('baaaaa');
    const tape3 = makeTape('baa');

    const joined = joinAutomatas(d_automata2, d_automata3);
    expect(readTape(joined, tape1)).toBeTruthy();
    expect(readTape(joined, tape2)).toBeTruthy();
    expect(readTape(joined, tape3)).toBeFalsy();
  });

  test('Join d_automata4 with d_automata5', () => {
    const tape1 = makeTape('ababa');
    const tape2 = makeTape('baaaa');
    const tape3 = makeTape('baaa');

    const joined = joinAutomatas(d_automata4, d_automata5);

    // console.log(inspect(joined, false, null))

    expect(readTape(joined, tape1)).toBeTruthy();
    expect(readTape(joined, tape2)).toBeTruthy();
    expect(readTape(joined, tape3)).toBeFalsy();
  });

  test('Join d_automata7 with d_automata7', () => {
    const tape1 = makeTape('aaaaa');
    const tape2 = makeTape('abbaabbaabb');
    const tape3 = makeTape('baa');

    const joined = joinAutomatas(d_automata7, d_automata7);

    expect(readTape(joined, tape1)).toBeTruthy();
    expect(readTape(joined, tape2)).toBeTruthy();
    expect(readTape(joined, tape3)).toBeFalsy();
  });
});

describe('Complement relation', () => {
  test('Structural test compelement d_automata2', () => {
    const { states, transitions, finals } = complementAutomata(d_automata2);

    expect(contains(
      { state: 'qCOMP', value: 'a', next: ['qCOMP'] }, transitions
    )).toBeTruthy();
    expect(contains(
      { state: 'qCOMP', value: 'b', next: ['qCOMP'] }, transitions
    )).toBeTruthy();
    expect(contains(
      { state: 'q2', value: 'a', next: ['qCOMP'] }, transitions
    )).toBeTruthy();
    expect(contains(
      { state: 'q1', value: 'b', next: ['qCOMP'] }, transitions
    )).toBeTruthy();

    expect(contains('qCOMP', states)).toBeTruthy();
    expect(contains('qCOMP', finals)).toBeTruthy();
  });

  test('Logic test complemenet d_automata4', () => {
    const tape1 = makeTape('aaabbba');
    const tape2 = makeTape('baba');

    const complemented = complementAutomata(d_automata4);

    expect(readTape(complemented, tape1)).toBeTruthy();
    expect(readTape(complemented, tape2)).toBeFalsy();
  });

  test('Logic test complemenet d_automata5', () => {
    const tape1 = makeTape('baaaabbbab');
    const tape2 = makeTape('baaaaa');
    const tape3 = makeTape('abababa');

    const complemented = complementAutomata(d_automata5);

    expect(readTape(complemented, tape1)).toBeTruthy();
    expect(readTape(complemented, tape2)).toBeTruthy();
    expect(readTape(complemented, tape3)).toBeFalsy();
  });

  test('Logic test complemenet d_automata7', () => {
    const tape1 = makeTape('abaabbba');
    const tape2 = makeTape('baaaaa');
    const tape3 = makeTape('abbba');

    const complemented = complementAutomata(d_automata7);
    expect(readTape(complemented, tape1)).toBeTruthy();
    expect(readTape(complemented, tape2)).toBeTruthy();
    expect(readTape(complemented, tape3)).toBeFalsy();
  });
});

describe('Intersection relation', () => {
  test('Logical test intersection d_automata2 d_automata3', () => {
    const tape1 = makeTape('aabbab');
    const tape2 = makeTape('bbaaabaa');
    const tape3 = makeTape('abababa');
    const tape4 = makeTape('aa');

    const intersect = intersectionAutomata(minimize(d_automata2), minimize(d_automata3));

    expect(readTape(intersect, tape1)).toBeTruthy();
    expect(readTape(intersect, tape2)).toBeTruthy();
    expect(readTape(intersect, tape3)).toBeFalsy();
    expect(readTape(intersect, tape4)).toBeFalsy();
  });
  test('Intersection test for automatas showed in class', () => {
    const expected = makeAutomata(
      ['q0', 'q1', 'q2'],
      ['a', 'b'],
      [{
        state: 'q1', value: 'a', next: ['q2']
      }, {
        state: 'q1', value: 'b', next: ['q0']
      }, {
        state: 'q2', value: 'b', next: ['q0']
      }, {
        state: 'q0', value: 'a', next: ['q2']
      }],
      'q1',
      ['q1', 'q2', 'q0']
    );
    const test = renameStates(minimize(intersectionAutomata(minimize(d_automata9), minimize(d_automata10))));
    expect(test).toEqual(expected);
    const tape1 = makeTape('ababababab');
    const tape2 = makeTape('babababa');
    const tape3 = makeTape('aaaabbb');
    const tape4 = makeTape('bbababab');

    expect(readTape(test, tape1)).toBeTruthy();
    expect(readTape(test, tape2)).toBeTruthy();
    expect(readTape(test, tape3)).toBeFalsy();
    expect(readTape(test, tape4)).toBeFalsy();

  });
});

describe('Difference relation', () => {
  test('Logical test intersection d_automata3 d_automata7', () => {
    const tape1 = makeTape('aabbab');
    const tape2 = makeTape('bbbbabb');
    const tape3 = makeTape('abaaba');
    const tape4 = makeTape('aaabbba');

    const intersect = intersectionAutomata(minimize(d_automata3), minimize(d_automata7));

    expect(readTape(intersect, tape1)).toBeTruthy();
    expect(readTape(intersect, tape2)).toBeTruthy();
    expect(readTape(intersect, tape3)).toBeFalsy();
    expect(readTape(intersect, tape4)).toBeFalsy();
  });
});

describe('Difference relation', () => {
  test('Logical test intersection d_automata4 d_automata7', () => {
    //TODO SOLVE TAPE2 BUG
    const tape1 = makeTape('aababab');
    const tape2 = makeTape('acbcbaabca');
    const tape3 = makeTape('abaaba');
    const tape4 = makeTape('aaabbba');

    const intersect = intersectionAutomata(minimize(d_automata4), minimize(d_automata7));

    expect(readTape(intersect, tape1)).toBeTruthy();
    expect(readTape(intersect, tape2)).toBeTruthy();
    expect(readTape(intersect, tape3)).toBeFalsy();
    expect(readTape(intersect, tape4)).toBeFalsy();
  });
});

describe('Equivalence and Contained', () => {
  test('Equivalence', () => {
    const regExp1 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('aa*bb*');
    const regExp2 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('a*ab*b');

    const regExp3 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('(ab|ba)*');
    const regExp4 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('(ba|ab)*');

    const regExp5 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('1?(01)*0?');
    const regExp6 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata)('0?(10)*1?');

    // const regExp7 = pipe(normalize,
                         // deDesimoneTree,
                         // deSimoneToAutomata)('1?1?(00?11?)*0?0?');
    // const regExp8 = pipe(normalize,
                         // deDesimoneTree,
                         // deSimoneToAutomata)('(1|0)?((10)*(01)*)*(1|0)?');

    const regExp9 = pipe(normalize,
                         deDesimoneTree,
                         deSimoneToAutomata
                         )('abba|bb*');
    const regExp10 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata
                          )('b*b|aba');

    const regExp11 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('bbabbac|bbabba');
    const regExp12 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('bbabba|bbabba');

    const regExp13 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('abaa|bb*');

    const regExp14 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('aaba|bb*');

    const regExp15 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('abbabbaba|bb*');

    const regExp16 = pipe(normalize,
                          deDesimoneTree,
                          deSimoneToAutomata)('abbabbaab|bb*');

    expect(isEquivalent(regExp1, regExp2)).toBeTruthy();
    expect(isEquivalent(regExp3, regExp4)).toBeTruthy();
    expect(isEquivalent(regExp5, regExp6)).toBeTruthy();
    // expect(isEquivalent(regExp7, regExp8)).toBeFalsy();
    expect(isEquivalent(regExp9, regExp10)).toBeFalsy();
    expect(isEquivalent(regExp11, regExp12)).toBeFalsy();
    expect(isEquivalent(regExp13, regExp14)).toBeFalsy();
    expect(isEquivalent(regExp15, regExp16)).toBeFalsy();
  });
});
