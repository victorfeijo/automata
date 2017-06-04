import { where, is, curry, __, isEmpty, equals, cond, or } from 'ramda';
import { isString } from '../Predicates';
import ENUM from '../Enum';

const specDeSimoneNode = deSimoneNode => (
  where({
    symbol: isString(__),
    left: is(Object)(__),
    right: is(Object)(__),
    parent: is(Object)(__),
  })(deSimoneNode)
);

export default function makeDeSimoneNode(symbol, left={}, right={}, parent={}) {
  const deSimoneNode = {
    symbol,
    left,
    right,
    parent,
  };

  return specDeSimoneNode(deSimoneNode) ? deSimoneNode : {};
};


/**
 * THIS FUNCTION MUTATES THE OBJECT! This decision was
 * made with performance issues. If it doesnt mutate, the
 * whole tree needs to be recreated on adding new node parents.
 * It also verify if the updated value is correct with
 * deSimoneNode specification.
 * @param {DeSimoneNode} deSimoneNode - DeSimoneNode to change.
 * @param {string} attr - Attr to change.
 * @param {any} value - Value to update attribute.
 * @return {DeSimoneNode} - The same node, mutated.
 */
const updateNode = curry((attr, deSimoneNode, value) => {
  const oldValue = deSimoneNode[attr];

  deSimoneNode[attr] = value;

  if (!specDeSimoneNode(deSimoneNode)) {
    deSimoneNode[attr] = oldValue;
  }

  return deSimoneNode;
});


const isLeafNode = deSimoneNode => (
  isEmpty(deSimoneNode.left) && isEmpty(deSimoneNode.right)
);

const isOrNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '|')
);

const isConcatNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '.')
);

const isCloseNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '*')
);

const isOptionNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '?')
);

const isThrowBackNode = deSimoneNode => (
  isLeafNode(deSimoneNode) ||
  isCloseNode(deSimoneNode) ||
  isOptionNode(deSimoneNode)
);

const isRootNode = deSimoneNode => (
  equals(ENUM.Lambda, deSimoneNode.parent)
);

const isLeftNode = deSimoneNode => (
  or(
    (deSimoneNode === deSimoneNode.parent.left),
    isRootNode(deSimoneNode)
  )
);

const throwBack = deSimoneNode => {
  if (isLeftNode(deSimoneNode)) {
    return deSimoneNode.parent;
  }

  return throwBack(deSimoneNode.parent);
};

const downMoveLeaf = deSimoneNode => (
  deSimoneNode
);

const downMoveOr = deSimoneNode => (
  [downMove(deSimoneNode.left), downMove(deSimoneNode.right)]
);

const downMoveConcat = deSimoneNode => (
  [downMove(deSimoneNode.left)]
);

const downMoveClose = deSimoneNode => (
  [downMove(deSimoneNode.left), upMove(throwBack(deSimoneNode))]
);

/**
 * Down move decider.
 * @param {DeSimoneNode} deSimoneNode - DeSimoneNode to change.
 * @return {array<DeSimoneNode>} - Found nodes.
 */
const downMove = deSimoneNode => (
  cond([
    [isLeafNode,   node => downMoveLeaf(node)],
    [isOrNode,     node => downMoveOr(node)],
    [isConcatNode, node => downMoveConcat(node)],
    [isCloseNode,  node => downMoveClose(node)],
    [isOptionNode, node => downMoveClose(node)],
  ])(deSimoneNode)
);

const upMoveLeaf = deSimoneNode => {
  if (equals(deSimoneNode, ENUM.Lambda)) {
    return deSimoneNode;
  }

  return [upMove(throwBack(deSimoneNode))]
};

const upMoveOr = deSimoneNode => {
  if (isThrowBackNode(deSimoneNode)) {
    return [upMove(throwBack(deSimoneNode))];
  }

  return upMoveOr(deSimoneNode.right);
};

const upMoveConcat = deSimoneNode => (
  [downMove(deSimoneNode.right)]
);

const upMoveClose = deSimoneNode => (
  [downMove(deSimoneNode.left), upMove(throwBack(deSimoneNode))]
);

const upMoveOption = deSimoneNode => (
  [upMove(throwBack(deSimoneNode))]
);

/**
 * Up move decider.
 * @param {DeSimoneNode} deSimoneNode - DeSimoneNode to change.
 * @return {array<DeSimoneNode>} - Found nodes.
 */
const upMove = deSimoneNode => (
  cond([
    [isLeafNode,   node => upMoveLeaf(node)],
    [isOrNode,     node => upMoveOr(node)],
    [isConcatNode, node => upMoveConcat(node)],
    [isCloseNode,  node => upMoveClose(node)],
    [isOptionNode, node => upMoveOption(node)],
  ])(deSimoneNode)
);

export {
  makeDeSimoneNode,
  updateNode,
  isLeafNode,
  isOrNode,
  isConcatNode,
  isCloseNode,
  isOptionNode,
  downMove,
  upMove,
};
