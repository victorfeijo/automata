import { isNil, isEmpty, contains, find, assoc,
         propEq, tail, head, filter, any, forEach,
         gte, length, map, append, flatten, range,
         uniq, clone, equals, without, reject, split,
         all, curry, reduce, union, concat, sort, pluck,
         update, indexOf, remove } from 'ramda';

import { errorTransition, isBlankTransition } from './specs/Automata';
import ENUM from './Enum';

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
 * @param {array<transitions>} transitions - Transitions to look.
 * @return {transition} - First found non deterministic transition.
 */
const firstNDTransition = transitions => (
  find(tran => gte(length(tran.next), 2))(transitions)
);

const firstBlankTransition = transitions => (
  find(tran => isBlankTransition(tran))(transitions)
);

/**
 * Return a set of error transitions.
 * @param {automata} automata - Automata to look.
 * @return {array<transitions>} - Error transitions with error.
 */
const errorTransitions = automata => (
  filter(tran => contains(ENUM.Error, tran.next),
    reduce((acc, state) => (
      union(
        map(sym =>
          findTransition(automata.transitions, state, sym),
          automata.alphabet),
        acc)
    ), [], automata.states))
);

/**
 * Return a set of transitions with error.
 * @param {automata} automata - Automata to look.
 * @return {array<transitions>} - Transitions with error.
 */
const withErrorTransitions = automata => (
  union(
    automata.transitions,
    errorTransitions(automata)
  )
);

/**
 * Change ERROR state to given name.
 * @param {array<transition>} transitions - Transitions to parse.
 * @param {string} name - Name to rename error state.
 * @return {array<transition>} - Transitions with state.
 */
const errorToState = curry((name, transitions) => (
  map(tran => (
    contains(ENUM.Error, tran.next) ? assoc(
      'next', update(indexOf(ENUM.ERROR, tran.next), name, tran.next), tran
    ) : tran
  ), transitions)
));

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
 * @param {Automata} automata - Deterministic automata to check.
 * @param {array<array>} equivalents - Set of equivalent states.
 * @param {string} stateA - State A to compare.
 * @param {string} stateB - State B to compare.
 * @return {bool} - If the given states are equivalents.
 */
const equivalentStates = curry((automata, equivalents, stateA, stateB) => {
  if (equals(stateA, stateB)) {
    return true;
  }

  const { transitions, alphabet } = automata;

  const stateATransitions = map(sym =>
    findTransition(transitions, stateA, sym), alphabet);
  const stateBTransitions = map(sym =>
    findTransition(transitions, stateB, sym), alphabet);

  return all((sym) => {
    const { next: symNextA } = find(propEq('value', sym), stateATransitions);
    const { next: symNextB } = find(propEq('value', sym), stateBTransitions);

    return any(equivalent => (
      contains(symNextA[0], equivalent) && contains(symNextB[0], equivalent)
    ), equivalents);
  }, alphabet);
});

/**
 * Reduce a set of pre-equivalent states in a final
 * transitive equivalent states group.
 * @param {Automata} automata - Deterministic automata to check.
 * @param {array<array>} equivalents - Set of pre-equivalent states.
 * @return {array<array>} - Final set of transitive equivalent states.
 */
function reduceEquivalents(automata, equivalents) {
  const reduced = reduce((acc, equivalent) => {
    const grouped = uniq(map(state => (
      filter(equivalentStates(automata, equivalents, state), equivalent)
    ), equivalent));

    return [...acc, ...grouped];
  }, [], equivalents);

  if (equals(reduced, equivalents)) {
    return reduced;
  }

  return reduceEquivalents(automata, reduced);
}
/**
 * Remove states that contain each other, eliminating
 * repetition inside the states.
 * @param {array<array>} states - Set of states with repetition.
 * @return {array<array>} - Set of states without repetition.
 */
function removeRepeatedStates(states) {
  const n = length(states);
  let i;
  let j;
  let noRepeatArr = [];
  let statesRemainder = clone(states);
  let indexToDel = [];
  for (i of range(0, n)) {
    for (j of range(0, n)) {
      if (i !== j && states[i].indexOf(states[j]) >= 0 ) {
        noRepeatArr = union(noRepeatArr,[states[i]]);
        indexToDel = append(states.indexOf(states[j]), indexToDel);
      }
    }
  }
  if (!isEmpty(indexToDel)) {
    const delElem = reduce((splt, i) => statesRemainder.splice(i, 1), [], indexToDel);
  }
  if (!isEmpty(noRepeatArr)) {
    return union(noRepeatArr, statesRemainder);
  } else {
    return statesRemainder;
  }
}

/**
 * Create a new Transition in automata.
 * @param {automata} automata - The automata which the new transition will be created.
 * @param {array<array>} states - Set of states that the new transition will use.
 * @return {Trasition} - New transition based on the parameters given.
*/
function createNewTransition(automata, states) {
  const { transitions, alphabet } = automata;
  let state;
  let symbol;
  let statesTransitions;
  for (state of states) {
    for (symbol of alphabet) {
      statesTransitions = union(statesTransitions, (map(sym =>
      findTransition(transitions, state, symbol), alphabet)));
    }
  }
  const filteredStates = removeRepeatedStates(states);
  let newState = reduce((newState, state) => concat(newState, state), '', filteredStates);

  let sym;
  let newTransitions;
  let newNext;
  let noRepeatArr;
  for (sym of alphabet) {

    const transSym = filter(propEq('value', sym), statesTransitions);
    let symNextAll = (reduce((acc, tran) => union(acc, filter(t => t !== ENUM.Error, tran.next)), [], transSym)).sort();

    noRepeatArr = removeRepeatedStates(symNextAll);

    newTransitions = union(newTransitions, [{state: newState, value: sym, next: noRepeatArr}]);
    newTransitions = filter(t => !isEmpty(t.next), newTransitions);
  }

  return newTransitions;
}

/**
 * Creates new automata transitions based on
 * equivalent states. It also transform the next
 * transition to a equivalent one.
 * @param {array<array>} equivalents - Set of equivalent states.
 * @param {Automata} automata - Automata to create new transitions.
 * @return {object} - A object with transitions and which states
 * generated then.
 */
function createEquivalentTransitions(equivalents, automata) {
  const generated = map(states => ({
    transitions: createNewTransition(automata, states),
    generatedBy: states,
  }), equivalents);

  return map((gen) => {
    const transitions = map((transition) => {
      const newNext = find(g => (
        all(n => contains(n, g.generatedBy), transition.next)
      ), generated);

      if (isNil(newNext)) {
        return transition;
      }
      return assoc('next', [newNext.transitions[0].state], transition);
    }, gen.transitions);
    return assoc('transitions', transitions, gen);
  }, generated);
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
  withErrorTransitions,
  errorToState,
  removeFromNext,
  transitiveTransitions,
  previousStates,
  equivalentStates,
  reduceEquivalents,
  createNewTransition,
  createEquivalentTransitions,
  readTape,
  firstBlankTransition,
  removeRepeatedStates,
};
