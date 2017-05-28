  import { isEmpty, contains, tail, head, filter, any, propEq, find,
         clone, difference, uniq, flatten, map, concat, append, reduce, union} from 'ramda';

import makeAutomata, { isDeterministic } from './Automata';
import { firstNDTransition, removeFromNext, transitiveTransitions, previousStates, findTransition } from './Operations';

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

function reduceEquivalents(automata, equivalents) {
}

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

  let newState = reduce((newState, state) => concat(newState, state), '', states);
  let sym;
  let newTransitions;
  let newNext;
  for (sym of alphabet) {

    const transSym = filter(propEq('value', sym), statesTransitions);
    const symNextAll = reduce((acc, tran) => union(acc, tran.next), [], transSym);

    newTransitions = union(newTransitions, [{state: newState, value: sym, next: symNextAll}]);
  }
  const newStates = append(newState, automata.states);

  let newFinals = automata.finals;
  if (any(state => contains(state, automata.finals), states)) {
    newFinals = union(newFinals, newState);
  }

  return makeAutomata(
    newStates,
    clone(automata.alphabet),
    union(automata.transitions, newTransitions),
    clone(automata.initial),
    newFinals,
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
  createNewTransition,
};
