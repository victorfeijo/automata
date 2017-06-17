import { isLeafNode, updateNode } from './specs/DeSimoneNode';
import { isEmpty, map, reduce, range, length, union, concat, clone, toString, append } from 'ramda';
import makeAutomata from '../core/specs/Automata'
/**
 * THIS FUNCTION MUTATES THE OBJECT! Helper function
 * to create deSimone trees easily.
 * @param {DeSimoneNode} deSimoneNode - DeSimoneNode to change.
 * @return {undefined} - Bad...
 */
const updateParents = deSimoneNode => {
  if (isLeafNode(deSimoneNode)) {
    return;
  }

  updateNode('parent', deSimoneNode.left, deSimoneNode);
  updateParents(deSimoneNode.left);

  if (!isEmpty(deSimoneNode.right)) {
    updateNode('parent', deSimoneNode.right, deSimoneNode);
    updateParents(deSimoneNode.right);
  }
};

const rangeStates = (char='q', amount=100) => (
  map(state => char + state, range(0, amount))
);

/**
 * This function will rename the states, transitions, initials
 * and finals of the automata. RenameStates will follow an alphabetical
 * and numerical order, hence the states will not necessarilly be standard,
 * q0 is not always initial, for example.
 * @param {automata} automata - automata to rename the states.
 * @return {Automata} - automata with the states renamed.
*/
function renameStates(automata) {
  const states = (automata.states).sort();
  let newStates;
  let i;
  for(i = 0; i < length(states); i++) {
    const nS = concat('q', i);
    newStates = union(newStates, [nS]);
  }
  let transition;
  let newTransitions;
  for(transition of automata.transitions) {
    const stateIndex = states.indexOf(transition.state);
    const nextIndex = reduce((indxs, next) => union(indxs, [states.indexOf(next)]), [], transition.next);
    const newNext = reduce((next, indx) => union(next, [newStates[indx]]), [], nextIndex);
    newTransitions = union(newTransitions, [{state: newStates[stateIndex],
                                             value: transition.value,
                                             next: newNext}]);

  }
  const initialIndex = states.indexOf(automata.initial);
  let newInitial = newStates[initialIndex];
  const finalIndex = reduce((indxs, final) => union(indxs, [states.indexOf(final)]), [], automata.finals);
  let newFinals = reduce((nF, indx) => union(nF, [newStates[indx]]), [], finalIndex);
  return makeAutomata(
    newStates,
    clone(automata.alphabet),
    newTransitions,
    newInitial,
    newFinals
  );

}

export {
  updateParents,
  rangeStates,
  renameStates,
};
