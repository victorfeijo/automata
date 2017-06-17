import { filter, equals, length, pipe, isEmpty } from 'ramda';

import { normalize, deDesimoneTree, deSimoneToAutomata } from '../../core/RegularExpression';

const isValidRegex = (regex) => (
  (length(regex) >= 2) && equals(
    length(filter(equals('('), regex)),
    length(filter(equals(')'), regex)),
  )
);

const toAutomata = (regex) => (
  pipe(
    normalize,
    deDesimoneTree,
    deSimoneToAutomata
  )(regex)
);

export {
  isValidRegex,
  toAutomata
};
