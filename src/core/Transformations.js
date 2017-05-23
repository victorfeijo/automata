import { isNil, isEmpty, contains, find,
         propEq, tail, head, filter, any,
         gte, length, map, append, unnest,
         uniq } from 'ramda';

import { makeAutomata, isDeterministic } from './Automata';
import { firstNDTransition } from './Operations';

function removeBlankTransitions(automata) {
}

function removeStates(automata, states) {
  if (isEmpty(states) || contains(automata.initial, states)) {
    return automata;
  }

  const remove = head(states);
  const leftTransitions = filter(t => t.state !== remove, automata.transitions);
}

function determineze(automata) {
  if (isDeterministic(automata)) {
    return automata;
  }

  console.log(firstNDTransition(automata.transitions));
}

export {
  removeBlankTransitions,
  determineze,
}
