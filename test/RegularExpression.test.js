import { normalize, deDesimoneTree, lessSignificant, deSimoneToAutomata } from '../src/core/RegularExpression';
import ENUM from '../src/core/Enum';
import makeTape from '../src/core/specs/Tape';
import { readTape } from '../src/core/Operations';

import { root2, root3, regex1, regex2, regex3, regex4, nRegex1, nRegex2, nRegex3, nRegex4 } from '../samples/RegularExpression';

describe('Regular Expression Transformations', () => {
  test('Normalize Regular Expression', () => {
    expect(normalize(regex1)).toEqual('a.c.b.d|d.d.a.b*.s.(c)*');
    expect(normalize(regex2)).toEqual('a.c.b*.a.s.c.v|d.s.a.d.(c)?');
    expect(normalize(regex3)).toEqual('a.c.b?.s.d|d.a.(c)*.a.a');
    expect(normalize(regex4)).toEqual('a.b.b.a.c*.s.d.a?.(a.b|a.s.d)*.(a.s.d|s.d)?.d.s.a');

  });

  test('Get less Significant of a Regex', () => {
    expect(lessSignificant(normalize(regex1))).toEqual(['|', '7']);
    expect(lessSignificant(normalize(regex2))).toEqual(['|', '14']);
    expect(lessSignificant(normalize(regex3))).toEqual(['|', '10']);
    expect(lessSignificant(normalize(regex4))).toEqual(['.', '1']);
  });

  test('Get deSimone Tree for regExp1', () => {
    const test1 = deDesimoneTree(nRegex1);

    expect(test1.symbol).toEqual('.');
    expect(test1.parent).toEqual(ENUM.Lambda);
    expect(test1.left.symbol).toEqual('?');
    expect(test1.left.parent.symbol).toEqual('.');
    expect(test1.left.left.symbol).toEqual('a');
    expect(test1.right.symbol).toEqual('.');
    expect(test1.right.left.symbol).toEqual('*');
    expect(test1.right.left.parent.symbol).toEqual('.');
    expect(test1.right.left.left.symbol).toEqual('.');
    expect(test1.right.left.left.left.symbol).toEqual('b');
    expect(test1.right.left.left.right.symbol).toEqual('a');
    expect(test1.right.right.symbol).toEqual('?');
    expect(test1.right.right.left.symbol).toEqual('b');
  });

  test('Get deSimone Tree for regExp2', () => {
    const test1 = deDesimoneTree(nRegex2);

    expect(test1.symbol).toEqual('.');
    expect(test1.parent).toEqual(ENUM.Lambda);
    expect(test1.left.symbol).toEqual('*');
    expect(test1.left.parent.symbol).toEqual('.');
    expect(test1.left.left.symbol).toEqual('|');
    expect(test1.left.left.left.symbol).toEqual('.');
    expect(test1.left.left.right.symbol).toEqual('.');
    expect(test1.left.left.right.left.symbol).toEqual('b');
    expect(test1.left.left.right.right.left.symbol).toEqual('*');
    expect(test1.left.left.right.right.left.parent.symbol).toEqual('.');
    expect(test1.right.symbol).toEqual('*');
    expect(test1.right.left.symbol).toEqual('.');
    expect(test1.right.left.parent.symbol).toEqual('*');
    expect(test1.right.left.left.symbol).toEqual('b');
    expect(test1.right.left.right.symbol).toEqual('a');
  });

  test('Get deSimone Tree for regExp3', () => {
    const test1 = deDesimoneTree(nRegex3);

    expect(test1.symbol).toEqual('.');
    expect(test1.parent).toEqual(ENUM.Lambda);
    expect(test1.left.symbol).toEqual('l');
    expect(test1.right.symbol).toEqual('*');
    expect(test1.right.left.symbol).toEqual('|');
    expect(test1.right.left.right.right.symbol).toEqual('l');
    expect(test1.right.left.right.left.symbol).toEqual('?');
    expect(test1.right.left.left.left.symbol).toEqual('?');
    expect(test1.right.left.right.left.left.symbol).toEqual('_');
    expect(test1.right.left.right.right.parent.symbol).toEqual('.');
    expect(test1.right.left.right.left.left.parent.symbol).toEqual('?');
    expect(test1.right.left.right.left.parent.symbol).toEqual('.');
  });
});

describe('DeSimoneNode tree transformation to Automata', () => {
  test('Transform root2 to Automata', () => {
    const automata = deSimoneToAutomata(root2);
    const tape1 = makeTape('bababa');
    const tape2 = makeTape('abababab');
    const tape3 = makeTape('babbaba');
    const tape4 = makeTape('babaaba');

    expect(automata.finals).toEqual(['q0', 'q1', 'q2']);

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('Transform root3 to Automata', () => {
    const automata = deSimoneToAutomata(root3);
    const tape1 = makeTape('bababa');
    const tape2 = makeTape('abbababb');
    const tape3 = makeTape('aababb');
    const tape4 = makeTape('bbabbbaa');

    expect(automata.finals).toEqual(['q0', 'q4']);

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });
});

describe('Integration test - Regexp to Automata', () => {
  test('Trick (a)* regex to automata', () => {
    const root = deDesimoneTree(normalize('(a)*'));
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('aaaa');
    const tape2 = makeTape('aaaaaaaaaaaaa');
    const tape3 = makeTape('ab');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
  });

  test('Regex1 to automata', () => {
    const root = deDesimoneTree(normalize(regex1));
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('acbd');
    const tape2 = makeTape('ddabbbbsccc');
    const tape3 = makeTape('adddba');
    const tape4 = makeTape('ddbbbbccc');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('Regex2 to automata', () => {
    const root = deDesimoneTree(normalize(regex2));
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('acbbbascv');
    const tape2 = makeTape('dsad');
    const tape3 = makeTape('dsadcacb');
    const tape4 = makeTape('acbbsd');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('Regex3 to automata', () => {
    const root = deDesimoneTree(normalize(regex3));
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('acbsd');
    const tape2 = makeTape('daccccccccaa');
    const tape3 = makeTape('dacccsaa');
    const tape4 = makeTape('acbsad');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('Regex4 to automata', () => {
    const root = deDesimoneTree(normalize(regex4));
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('abbacccsddsa');
    const tape2 = makeTape('abbasdaabasddsa');
    const tape3 = makeTape('abbasdaabasdda');
    const tape4 = makeTape('acbsad');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('nRegex1 to automata', () => {
    const root = deDesimoneTree(nRegex1);
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('bababa');
    const tape2 = makeTape('abababab');
    const tape3 = makeTape('babbaba');
    const tape4 = makeTape('babaaba');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('nRegex2 to automata', () => {
    const root = deDesimoneTree(nRegex2);
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('bababa');
    const tape2 = makeTape('abbababb');
    const tape3 = makeTape('aababb');
    const tape4 = makeTape('bbabbbaa');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('nRegex3 to automata', () => {
    const root = deDesimoneTree(nRegex3);
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('l');
    const tape2 = makeTape('l_d_l_d_l');
    const tape3 = makeTape('l__d');
    const tape4 = makeTape('d_d_l');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
    expect(readTape(automata, tape4)).toBeFalsy();
  });

  test('nRegex4 bomb to automata', () => {
    const root = deDesimoneTree(nRegex4);
    const automata = deSimoneToAutomata(root);

    const tape1 = makeTape('abbbabbba');
    const tape2 = makeTape('bbbbbbabbb');
    const tape3 = makeTape('bbabb');

    expect(readTape(automata, tape1)).toBeTruthy();
    expect(readTape(automata, tape2)).toBeTruthy();
    expect(readTape(automata, tape3)).toBeFalsy();
  });
});
