import { isEmpty, contains, tail, head, filter,
         any, find, clone, difference, uniq, length,
         flatten, map, reduce, union, pluck, pipe, splitEvery,
         sort, propEq, equals, concat, append } from 'ramda';

import makeAutomata, { isDeterministic } from './Automata';

import { firstNDTransition, removeFromNext,
         transitiveTransitions, previousStates,
         reduceEquivalents, createNewTransition,
         createEquivalentTransitions } from './Operations';

/**
 * Remove a collection of states from given automata.
 * @param {Automata} automata - Automata to clean.
 * @param {array<string>} states - States to remove.
 * @return {Automata} - A new automata without give states.
 */
function removeStates(automata, states) {
  if (isEmpty(states) || contains(automata.initial, states)) {
    return automata;
  }

  const remove = head(states);
  const leftTransitions = filter(t => t.state !== remove, automata.transitions);

  return removeStates(makeAutomata(
    filter(s => s !== remove, automata.states),
    clone(automata.alphabet),
    removeFromNext(remove, leftTransitions),
    clone(automata.initial),
    filter(f => f !== remove, automata.finals),
  ), tail(states));
}

/**
 * Remove all unreachable states from automata.
 * @param {Automata} automata - Automata to clean.
 * @return {Automata} - A new automata without unreachable states.
 */
function removeUnreachables(automata) {
  const { states, transitions, initial } = automata;

  const reachable = transitiveTransitions(initial, transitions);

  return removeStates(automata, difference(states, reachable));
}

/**
 * Remove all dead states from automata.
 * @param {Automata} automata - Automata to clean.
 * @return {Automata} - A new automata without dead states.
 */
function removeDeads(automata) {
  const { states, transitions, finals } = automata;

  const validStates = uniq(flatten(map(final =>
    previousStates(final, transitions), finals)));

  return removeStates(automata, difference(states, validStates));
}

/**
 * Transform the given automata in a new automata
 * without equivalent states.
 * @param {Automata} automata - Automata to clean.
 * @return {Automata} - A new automata without equivalent states.
 */
function removeEquivalent(automata) {
  const { states, alphabet, initial, finals } = automata;
  const nonFinals = difference(states, finals);

  const equivalents = reduceEquivalents(automata, [nonFinals, finals]);
  const transitions = createEquivalentTransitions(equivalents, automata);

  return makeAutomata(
    reduce((acc, tran) =>
      union(acc, pluck('state', tran.transitions)), [], transitions),
    clone(alphabet),
    reduce((acc, tran) =>
      union(acc, tran.transitions), [], transitions),
    find(tran =>
      contains(initial, tran.generatedBy), transitions).transitions[0].state,
    map(tran => tran.transitions[0].state,
      filter(tran => any(state => contains(state, finals), tran.generatedBy), transitions)),
  );
}

/**
 * Apply a set of core functions to minimize the automata.
 * First, it removes all unreachable states.
 * Then, remove all dead states from the new automata.
 * Finally, creates a new automata without equivalent states.
 * @param {Automata} automata - Automata to minimize.
 * @return {Automata} - A new minimzed automata.
 */
function minimize(automata) {
  if (!isDeterministic(automata)) {
    throw new Error('Automata should be deterministic to minimize.');
  }

  return pipe(removeUnreachables,
              removeDeads,
              removeEquivalent)(automata);
}

function createDetTransition(automata, ndTransition) {
  const newState = reduce((newState, state) => concat(newState, state), '', ndTransition.next);
  let filterTrans = filter(t => !equals(ndTransition, t), automata.transitions);
  let newTransitions;
  const editNdTransition = [{state: ndTransition.state, value: ndTransition.value, next: [newState]}];

  let filterTest = filter(t => equals(t, newState), automata.states);
  if (length(filterTest) > 0) {
    newTransitions = union(filterTrans, editNdTransition);
    return makeAutomata (
      automata.states,
      clone(automata.alphabet),
      newTransitions,
      clone(automata.initial),
      union(automata.finals, newFinals),
    );
  }

  let newTransitionAdd = createNewTransition(automata, ndTransition.next);

  let newFinals = automata.finals;
  if (any(f => contains(f, automata.finals), ndTransition.next)) {
    newFinals = union(newFinals, [newState]);
  }

  newTransitions = union(union(filterTrans, newTransitionAdd), editNdTransition);

  return makeAutomata(
    uniq(append(newState, automata.states)),
    clone(automata.alphabet),
    newTransitions,
    clone(automata.initial),
    union(automata.finals, newFinals),

  );
}

function determineze(automata) {
  if (isDeterministic(automata)) {
    return automata;
  }

  const ndTransition = firstNDTransition(automata.transitions);
  const nAutomata = createDetTransition(automata, ndTransition);
  let detAutomata = determineze(nAutomata);
  return detAutomata;

}

export {
  minimize,
  removeStates,
  removeUnreachables,
  removeDeads,
  determineze,
  createDetTransition,
  removeEquivalent,
};
