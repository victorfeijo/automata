import { filter, equals, length, pipe, isEmpty } from 'ramda';

import { normalize, deDesimoneTree, deSimoneToAutomata } from '../../core/RegularExpression';

import { isEquivalent, isContained } from '../../core/Relations';

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

const checkEquivalence = (regexA, regexB) => {
  const automataA = toAutomata(regexA);
  const automataB = toAutomata(regexB);

  return isEquivalent(automataA, automataB);
}

const checkIsContained = (regexA, regexB) => {
  const automataA = toAutomata(regexA);
  const automataB = toAutomata(regexB);

  return isContained(automataA, automataB);
}

export {
  isValidRegex,
  toAutomata,
  checkEquivalence,
  checkIsContained,
};
