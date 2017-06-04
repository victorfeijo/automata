import { normalize, deDesimoneTree, lessSignificant } from '../src/core/RegularExpression';

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
  test('Get deSimone Tree', () => {
    const reg1 = normalize('acb*ascvdsa.d(c)?');
    console.log(deDesimoneTree(reg1));
  });
});
