  import { isEmpty, contains, tail, head, filter, any, propEq, find,
    clone, difference, uniq, flatten, map, concat, append, reduce,
    union, pluck } from 'ramda';

import makeAutomata, { isDeterministic } from './Automata';
import { firstNDTransition, removeFromNext, transitiveTransitions, previousStates, findTransition, reduceEquivalents, createNewTransition } from './Operations';

function removeBlankTransitions(automata) {
}


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

function minEquivalent(automata) {
  const { states, alphabet, initial, finals } = automata;
  const nonFinals = difference(states, finals);

  const equivalents = reduceEquivalents(automata, [nonFinals, finals]);

  const transitions = map((states) => ({
    transitions: createNewTransition(automata, states),
    generatedBy: states,
  }), equivalents);

  return makeAutomata(
    reduce((acc, tran) =>
      union(acc, pluck('state', tran.transitions)), [], transitions),
    clone(alphabet),
    reduce((acc, tran) =>
      union(acc, tran.transitions), [], transitions),
    find((tran) =>
      contains(initial, tran.generatedBy), transitions).transitions[0].state,
    map((tran) => tran.transitions[0].state,
      filter((tran) => any((state) => contains(state, finals), tran.generatedBy), transitions)),
  );
}

function createDetTransition(automata, ndTransition) {
}

function determineze(automata) {
  if (isDeterministic(automata)) {
    return automata;
  }

  const ndTransition = firstNDTransition(automata.transitions);
  const nAutomata = createNewTransition(automata, ndTransition);
  let detAutomata = determineze(nAutomata);
  detAutomata = removeUnreachables(detAutomata);
  return detAutomata;

  console.log(firstNDTransition(automata.transitions));
}

export {
  removeBlankTransitions,
  removeStates,
  removeUnreachables,
  removeDeads,
  determineze,
  createDetTransition,
  minEquivalent,
};
