import { filter, equals, length, pipe, isEmpty } from 'ramda';

import { normalize, deDesimoneTree, deSimoneToAutomata } from '../../core/RegularExpression';

const isValidRegex = (regex) => (
  !isEmpty(regex) && equals(
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
