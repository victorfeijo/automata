import { d_automata1,
         d_automata2,
         d_automata3,
         d_automata4,
         d_automata5,
         d_automata6,
         d_automata7 } from '../samples/Deterministic';
import { nd_automata3 } from '../samples/NonDeterministic';
import { joinAutomatas,
         complementAutomata,
         intersectionAutomata,
         differenceAutomata } from '../src/core/Relations';
import { readTape } from '../src/core/Operations';
import makeTape from '../src/core/specs/Tape';
import { contains } from 'ramda';

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

    const intersect = intersectionAutomata(d_automata2, d_automata3);

    expect(readTape(intersect, tape1)).toBeTruthy();
    expect(readTape(intersect, tape2)).toBeTruthy();
    expect(readTape(intersect, tape3)).toBeFalsy();
    expect(readTape(intersect, tape4)).toBeFalsy();
  });
});

describe('Difference relation', () => {
  test('Logical test intersection d_automata3 d_automata7', () => {
    const tape1 = makeTape('aabbab');
    const tape2 = makeTape('bbbbabb');
    const tape3 = makeTape('abaaba');
    const tape4 = makeTape('aaabbba');

    const intersect = intersectionAutomata(d_automata3, d_automata7);

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

    const intersect = intersectionAutomata(d_automata4, d_automata7);

    expect(readTape(intersect, tape1)).toBeTruthy();
    expect(readTape(intersect, tape2)).toBeTruthy();
    expect(readTape(intersect, tape3)).toBeFalsy();
    expect(readTape(intersect, tape4)).toBeFalsy();
  });
});
