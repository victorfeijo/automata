import makeDeSimoneNode, { updateNode } from '../src/core/specs/DeSimoneNode';
import { updateParents } from '../src/core/Utils';
import ENUM from '../src/core/Enum';

// R = (a | bc)*
// WITHOUT PARENTS
const root1 = makeDeSimoneNode(
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

// R = (ab|b(ab)*b)*(ba)*
const root3 = makeDeSimoneNode(
  '.',
  makeDeSimoneNode(
    '*',
    makeDeSimoneNode(
      '|',
      makeDeSimoneNode(
        '.',
        makeDeSimoneNode('a'),
        makeDeSimoneNode('b')
      ),
      makeDeSimoneNode(
        '.',
        makeDeSimoneNode('b'),
        makeDeSimoneNode(
          '.',
          makeDeSimoneNode(
            '*',
            makeDeSimoneNode(
              '.',
              makeDeSimoneNode('a'),
              makeDeSimoneNode('b')
            )
          ),
          makeDeSimoneNode('b')
        )
      )
    )
  ),
  makeDeSimoneNode(
    '*',
    makeDeSimoneNode(
      '.',
      makeDeSimoneNode('b'),
      makeDeSimoneNode('a')
    )
  ),
  ENUM.Lambda
);
updateParents(root3);

export {
  root1,
  root2,
  root3,
};

