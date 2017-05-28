import { isNil, isEmpty, contains, find,
         propEq, tail, head, filter, any,
         gte, length, map, append, flatten,
         uniq, clone, equals, without, reject,
         all} from 'ramda';

import { errorTransition } from './Automata';

/**
 * Find a transition.
 * @param {array<object>} transitions - Transitions to look.
 * @param {string} state - State to find.
 * @param {string} value - Value to filter transitions.
 * @return {transition} - Found transition or error transition.
 */
const findTransition = (transitions, state, value) => (
  (find(propEq('value', value))(
    filter(propEq('state', state), transitions),
  ) || errorTransition(state, value))
);

/**
 * Find the first non deterministic transition.
 * @param {array<object>} transitions - Transitions to look.
 * @return {object} - First found non deterministic transition.
 */
const firstNDTransition = transitions => (
  find(tran => gte(length(tran.next), 2))(transitions)
);

/**
 * Removes given state from next transitions.
 * @param {string} state - State to remove.
 * @param {array<object>} transitions - Transitions to look.
 * @return {array<object>} - New collection of transitions.
 */
const removeFromNext = (state, transitions) => (
  reject(isNil, map((transition) => {
    if (!contains(state, transition.next)) {
      return clone(transition);
    }

    return equals(length(transition.next), 1) ? null :
    {
      state: transition.state,
      value: transition.value,
      next: without(state, transition.next),
    };
  }, transitions))
);

/**
 * Find all transitive transitions from a given state.
 * @param {string} state - Starting state.
 * @param {array<object>} transitions - All automata transitions.
 * @param {array<string>} visited - Visited states to stop recursion.
 * @return {array<string>} - List of all transitive (not ordered).
 */
function transitiveTransitions(state, transitions, visited = []) {
  if (contains(state, visited)) {
    return visited;
  }

  const stateTransitions = filter(propEq('state', state), transitions);

  if (isEmpty(stateTransitions)) {
    return append(state, visited);
  }

  return uniq(flatten(map(tran =>
           (map(next =>
             transitiveTransitions(next, transitions, append(state, visited)),
           tran.next)),
         stateTransitions)));
}

/**
 * Find all previous states from a given state.
 * @param {string} state - Starting state.
 * @param {array<object>} transitions - All automata transitions.
 * @param {array<string>} visited - Visited states to stop recursion.
 * @return {array<string>} - List of all previous (not ordered).
 */
function previousStates(state, transitions, visited = []) {
  if (contains(state, visited)) {
    return visited;
  }

  const prvTransitions = filter(t => contains(state, t.next), transitions);

  if (isEmpty(prvTransitions)) {
    return append(state, visited);
  }

  return uniq(flatten(map(tran =>
    previousStates(tran.state, transitions, append(state, visited)),
    prvTransitions,
  )));
}

/**
 * Check if the given state A is equivalent to state B
 * on the current equivalents set.
 * @param {string} stateA - State A to compare.
 * @param {string} stateB - State B to compare.
 * @param {array<array>} equivalents - Set of equivalent states.
 * @param {Automata} automata - Automata to check.
 * @return {bool} - If the given states are equivalents.
 */
function equivalentStates(stateA, stateB, equivalents, automata) {
  const { transitions, alphabet } = automata;

  const stateATransitions = map(sym =>
    findTransition(transitions, stateA, sym), alphabet);

  const stateBTransitions = map(sym =>
    findTransition(transitions, stateB, sym), alphabet);

  return all(sym => {
    const { next:symNextA } = filter(propEq('value', sym), stateATransitions)[0];
    const { next:symNextB } = filter(propEq('value', sym), stateBTransitions)[0];

    return any(equivalent => (
      contains(symNextA[0], equivalent) && contains(symNextB[0], equivalent)
    ), equivalents);
  }, alphabet);
}

/**
 * Recursive check transitions to read a tape.
 * @param {string} actual - Actual recursion looking state (starts with q0).
 * @param {array<object>} transitions - All automata transitions.
 * @param {array<string>} finals - All automata final states.
 * @param {array<string>} left - List of left tape values.
 * @return {bool} - If transitions accepts a given tape.
 */
function verifyTape(actual, transitions, finals, left) {
  if (isNil(actual) || isEmpty(left)) {
    return contains(actual, finals);
  }

  const actualTransition = findTransition(transitions, actual, head(left));

  return any(next => verifyTape(next, transitions, finals, tail(left)),
             actualTransition.next);
}

/**
 * Verify if automata accepts a tape.
 * @param {Automata} automata - Automata to check (DFA or NDFA without &-transitions).
 * @param {Tape} tape - Given tape.
 * @return {bool} - If automata accepts or not the given tape.
 */
const readTape = (automata, tape) => (
  verifyTape(automata.initial,
             automata.transitions,
             automata.finals,
             tape.values)
);

export {
  findTransition,
  firstNDTransition,
  removeFromNext,
  transitiveTransitions,
  previousStates,
  equivalentStates,
  readTape,
};
