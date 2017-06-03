import { where, is, curry, __, isEmpty, equals } from 'ramda';
import { isString } from '../Predicates';

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
export const updateNode = curry((attr, deSimoneNode, value) => {
  const oldValue = deSimoneNode[attr];

  deSimoneNode[attr] = value;

  if (!specDeSimoneNode(deSimoneNode)) {
    deSimoneNode[attr] = oldValue;
  }

  return deSimoneNode;
});

export const isLeafNode = deSimoneNode => (
  isEmpty(deSimoneNode.left) && isEmpty(deSimoneNode.right)
);

export const isOrNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '|')
);

export const isConcatNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '.')
);

export const isCloseNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '*')
);

export const isOptionNode = deSimoneNode => (
  equals(deSimoneNode.symbol, '?')
);
