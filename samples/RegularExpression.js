import makeDeSimoneNode, { updateNode, updateParents } from '../src/core/specs/DeSimoneNode';
import ENUM from '../src/core/Enum';

// R = (a | bc)*
// WITHOUT PARENTS
export const root1 = makeDeSimoneNode(
  '*',
  makeDeSimoneNode(
    '|',
    makeDeSimoneNode('a'),
    makeDeSimoneNode(
      '.',
      makeDeSimoneNode('b'),
      makeDeSimoneNode('c')
    )
  )
);

// R = a?(ba)*b?
const root2 = makeDeSimoneNode(
  '.',
  makeDeSimoneNode(
    '?',
    makeDeSimoneNode('a')
  ),
  makeDeSimoneNode(
    '.',
    makeDeSimoneNode(
      '*',
      makeDeSimoneNode(
        '.',
        makeDeSimoneNode('b'),
        makeDeSimoneNode('a')
      )
    ),
    makeDeSimoneNode(
      '?',
      makeDeSimoneNode('b')
    )
  ),
  ENUM.Lambda
);
updateParents(root2);
export { root2 };

