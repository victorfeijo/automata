import { d_automata1,
         d_automata2,
         d_automata4,
         d_automata5,
         d_automata7 } from '../samples/Deterministic';

import { joinAutomatas, complementAutomata } from '../src/core/Relations';
import { readTape } from '../src/core/Operations';
import makeTape from '../src/core/Tape';

import { contains } from 'ramda';

describe('Union relation', () => {
  test('Join d_automata1 with d_automata2', () => {
    const joined = joinAutomatas(d_automata1, d_automata2);
  });

  test('Join d_automata5 with d_automata5', () => {
    const joined = joinAutomatas(d_automata5, d_automata5);
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
