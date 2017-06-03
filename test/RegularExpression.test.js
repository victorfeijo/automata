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
});
