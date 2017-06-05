import makeDeSimoneNode, { updateNode } from '../src/core/specs/DeSimoneNode';
import { normalize } from '../src/core/RegularExpression';
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

// NOT NORMALIZED
const regex1 = '(acbd|ddab*s(c)*)';
const regex2 = 'acb*ascv|dsa.d(c)?';
const regex3 = 'acb?sd|da(c)*aa';
const regex4 = 'abbac*sda?(ab|asd)*(asd|sd)?dsa';

//NORMALIZED
const nRegex1 = normalize('a?(ba)*b?');
const nRegex2 = normalize('(ab|b(ab)*b)*(ba)*');
const nRegex3 = normalize('l(_?d|_?l)*');

export {
  root1,
  root2,
  root3,
  regex1,
  regex2,
  regex3,
  regex4,
  nRegex1,
  nRegex2,
  nRegex3,
};

