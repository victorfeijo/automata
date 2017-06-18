import { union, concat, clone, difference,
         map, contains, pipe, any } from 'ramda';
import { determineze, distinguishStates, removeBlankTransitions } from './Transformations';
import { withErrorTransitions, errorToState, transitiveTransitions } from './Operations';
import {renameStates} from './Utils';
import makeAutomata from './specs/Automata';
import ENUM from './Enum';

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
    value: ENUM.Epsilon,
    next: [distinguishA.initial, distinguishB.initial]
  };

  let joinedAutomata = removeBlankTransitions(
    makeAutomata(
      union([newInitialTransition.state],
        union(distinguishA.states, distinguishB.states)),
      union(distinguishA.alphabet, distinguishB.alphabet),
      union([newInitialTransition],
        union(distinguishA.transitions, distinguishB.transitions)),
      newInitialTransition.state,
      union(distinguishA.finals, distinguishB.finals)
    )
  );
  joinedAutomata = renameStates(joinedAutomata);
  return determineze(joinedAutomata);
}

/**
 * Apply complemenet property to automata
 * @param {Automata} automata - Automata to complement.
 * @param {string?} newState - State name to complemenent error.
 * @return {Automata} - Complement automata.
 */
function complementAutomata(automata, newState = 'qCOMP') {
  const automataNotBlank = removeBlankTransitions(automata);
  const automataDet = determineze(automataNotBlank);
  if (!contains('qCOMP', automataDet.states)) {
      const transitions = pipe(
        withErrorTransitions,
        errorToState(newState)
      )(automata);

      const newTransitions = map(sym => ({
        state: newState,
        value: sym,
        next: [newState]
          }), automataDet.alphabet);
      return makeAutomata(
        union([newState], automataDet.states),
        clone(automataDet.alphabet),
        union(newTransitions, transitions),
        clone(automataDet.initial),
        union([newState], difference(automataDet.states, automataDet.finals))
      );
  }
  return makeAutomata(
    clone(automataDet.states),
    clone(automataDet.alphabet),
    clone(automataDet.transitions),
    clone(automataDet.initial),
    clone(difference(automataDet.states, automataDet.finals))
  )
}

function intersectionAutomata(automataA, automataB) {
  return complementAutomata(
    joinAutomatas(
      complementAutomata(automataA),
      complementAutomata(automataB)
    )
  );
}

function differenceAutomata(automataA, automataB) {
  return intersectionAutomata(
    automataA,
    complementAutomata(automataB)
  );
}

function isContained(automataA, automataB) {
  const difference = differenceAutomata(automataA, automataB);
  const diff = renameStates(difference);
  // console.log('DIFFERENCE => ', diff);
  const reachables = transitiveTransitions(
    diff.initial,
    diff.transitions
  );
  // console.log('RECHEABLES => ', reachables);
  return !any(s => contains(s, diff.finals), reachables);
}

const isEquivalent = (automataA, automataB) => (
  isContained(automataA, automataB) &&
  isContained(automataB, automataA)
);

export {
  joinAutomatas,
  complementAutomata,
  intersectionAutomata,
  differenceAutomata,
  isContained,
  isEquivalent,
}
