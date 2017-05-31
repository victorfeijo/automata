import { union, concat, clone, difference,
         map, contains, pipe } from 'ramda';
import { distinguishStates } from './Transformations';
import { withErrorTransitions, errorToState } from './Operations';
import makeAutomata from './Automata';

/**
 * Apply union property relation between automataA and
 * automata B.
 * @param {Automata} automataA - Automata to union.
 * @param {Automata} automataB - Automata to union.
 * @return {Automata} - Joined automata.
 */
function joinAutomatas(automataA, automataB) {
  const distinguishA = distinguishStates(automataA, 'A');
  const distinguishB = distinguishStates(automataB, 'B');

  const newInitialTransition = {
    state: concat(distinguishA.initial, distinguishB.initial),
    value: '&',
    next: [distinguishA.initial, distinguishB.initial]
  };

  return makeAutomata(
    union([newInitialTransition.state],
      union(distinguishA.states, distinguishB.states)),
    union(distinguishA.alphabet, distinguishB.alphabet),
    union([newInitialTransition],
      union(distinguishA.transitions, distinguishB.transitions)),
    newInitialTransition.state,
    union(distinguishA.finals, distinguishB.finals)
  );
}

function complementAutomata(automata, newState = 'qCOMP') {
  const transitions = pipe(
    withErrorTransitions,
    errorToState(newState)
  )(automata);

  const newTransitions = map(sym => ({
    state: newState,
    value: sym,
    next: [newState]
  }), automata.alphabet);

  return makeAutomata(
    union([newState], automata.states),
    clone(automata.alphabet),
    union(newTransitions, transitions),
    clone(automata.initial),
    union([newState], difference(automata.states, automata.finals))
  );
}

export {
  joinAutomatas,
  complementAutomata
}
