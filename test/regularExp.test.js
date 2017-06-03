import { normalize, deDesimoneTree, lessSignificant } from '../src/core/regularExp';

describe('Regular Expression Transformations', () => {
  test('Normalize Regular Expression', () => {
    const reg = '(acbd|ddab*s(c)*)';
    console.log(deDesimoneTree(reg));
  });
});
