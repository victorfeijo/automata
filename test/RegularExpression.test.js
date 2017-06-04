import { normalize, deDesimoneTree, lessSignificant, deSimoneToAutomata } from '../src/core/RegularExpression';
import ENUM from '../src/core/Enum';

import { root2, root3 } from '../samples/RegularExpression';

describe('Regular Expression Transformations', () => {
  test('Normalize Regular Expression', () => {
    const reg1 = '(acbd|ddab*s(c)*)';
    const reg2 = 'acb*ascv|dsa.d(c)?';
    const reg3 = 'acb?sd|da(c)*aa';
    const reg4 = 'abbac*sda?(ab|asd)*(asd|sd)?dsa';
    expect(normalize(reg1)).toEqual('a.c.b.d|d.d.a.b*.s.(c)*');
    expect(normalize(reg2)).toEqual('a.c.b*.a.s.c.v|d.s.a.d.(c)?');
    expect(normalize(reg3)).toEqual('a.c.b?.s.d|d.a.(c)*.a.a');
    expect(normalize(reg4)).toEqual('a.b.b.a.c*.s.d.a?.(a.b|a.s.d)*.(a.s.d|s.d)?.d.s.a');

  });
  test('Get less Significant of a Regex', () => {
    const reg1 = normalize('(acbd|ddab*s(c)*)');
    const reg2 = normalize('acb*ascvdsa.d(c)?');
    const reg3 = normalize('acb?sd|da(c)*aa');
    const reg4 = normalize('abbac*sda?(ab|asd)*(asd|sd)?dsa');

    expect(lessSignificant(reg1)).toEqual(['|', '7']);
    expect(lessSignificant(reg2)).toEqual(['.', '1']);
    expect(lessSignificant(reg3)).toEqual(['|', '10']);
    expect(lessSignificant(reg4)).toEqual(['.', '1']);
  });
  test('Get deSimone Tree for regExp1', () => {
    const reg1 = normalize('a?(ba)*b?');
    let test1 = deDesimoneTree(reg1);
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
    const reg1 = normalize('(ab|b(ab)*b)*(ba)*');
    let test1 = deDesimoneTree(reg1);
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
    const reg1 = normalize('l(_?d|_?l)*');
    let test1 = deDesimoneTree(reg1);
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
    // deSimoneToAutomata(root2)
  });
});
