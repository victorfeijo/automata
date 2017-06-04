import { isLeafNode, updateNode } from './specs/DeSimoneNode';
import { isEmpty, map, range } from 'ramda';

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

export {
  updateParents,
  rangeStates
};
