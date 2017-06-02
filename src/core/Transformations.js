import { isEmpty, contains, tail, head, filter,
         any, find, clone, difference, uniq, length, forEach,
         flatten, map, reduce, union, pluck, pipe, splitEvery,
         sort, propEq, equals, concat, append } from 'ramda';

import makeAutomata, { isDeterministic, hasBlankTransitions } from './Automata';

import { firstNDTransition, removeFromNext,
         transitiveTransitions, previousStates,
         reduceEquivalents, createNewTransition,
         createEquivalentTransitions, firstBlankTransition} from './Operations';


/**
 * Distinguish all states from given automata
 * concating a character in all states.
 * @param {Automata} automata - Automata to distinguish.
 * @return {Automata} - A new automata with states + char.
 */
function distinguishStates(automata, char) {
  const newTransitions = map(transition => (
    {
      state: concat(transition.state, char),
      value: clone(transition.value),
      next: map(n => concat(n, char), transition.next),
    }
  ), automata.transitions);

  return makeAutomata(
    map(s => concat(s, char), automata.states),
    clone(automata.alphabet),
    newTransitions,
    concat(automata.initial, char),
    map(f => concat(f, char), automata.finals)
  );
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
/**
 * Create a new deterministic transition and its dependencies.
 * First rename a new state for the newTransition.
 * Filter transitions to remove non-deterministic transition
 */
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

function removeBlankTransitions(automata) {
  if (!hasBlankTransitions(automata)) {
    return automata;
  }
  const blankTransition = firstBlankTransition(automata.transitions);

  let filterTrans = filter(t =>
    !equals(t, blankTransition), automata.transitions);

  const filterBlankValues = filter(
    val => val !== '&',
    reduce(
      (acc, tran) => union(acc, tran.value),
      [],
      filter(t => equals(blankTransition.state, t.state), automata.transitions)
    )
  );
  const filterBlankStates = filter(tran =>
    equals(blankTransition.state, tran.state), automata.transitions);
  const blankNext = blankTransition.next;
  let blankNextTransitions = filter(tran =>
    contains(tran.state, blankNext), automata.transitions);
  const blankAlphabet = reduce((acc, tran) =>
    union(acc, tran.value), [], blankNextTransitions);

  if (contains(blankTransition.state, blankTransition.next)) {
    blankNextTransitions = filter(bNT =>
      !equals(bNT, blankTransition), blankNextTransitions);
  }

  const newTransitions = reduce((acc, trans) => union(acc, trans), [],
    map(sym => {
      const symTran = filter(t => t.value === sym, blankNextTransitions);
      const joinNext = reduce((acc, tran) => union(acc, tran.next), [], symTran);

      if (contains(sym, filterBlankValues)) {
        const transitionByValue = find(propEq('value', sym), filterBlankStates);
        const transitionDuplicate = [
          {state: blankTransition.state, value: sym, next: transitionByValue.next}
        ];
        filterTrans = filter(t => !equals(t, transitionDuplicate[0]), filterTrans);
        const newNext = union(joinNext, transitionByValue.next);

        return [{ state: blankTransition.state, value: sym, next: newNext }];
      } else {
        return [{ state: blankTransition.state, value: sym, next: joinNext }]
      }
    }, blankAlphabet));
  let newFinals = automata.finals;
  console.log(blankTransition.next);
  console.log(automata.finals);
  if (any(state => contains(state, automata.finals), blankTransition.next)) {
    console.log('entered!');
    newFinals = union(newFinals, [blankTransition.state]);
  }
  return removeBlankTransitions(makeAutomata(
    clone(automata.states),
    clone(automata.alphabet),
    union(filterTrans, newTransitions),
    clone(automata.initial),
    newFinals,
  ));
}

export {
  distinguishStates,
  minimize,
  removeStates,
  removeUnreachables,
  removeDeads,
  determineze,
  createDetTransition,
  removeEquivalent,
  removeBlankTransitions,
};
