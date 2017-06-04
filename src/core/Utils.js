import { isLeafNode, updateNode } from './specs/DeSimoneNode';
import { isEmpty } from 'ramda';

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

export {
  updateParents
};
