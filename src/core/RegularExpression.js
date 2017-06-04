import {add, subtract, uniq, clone, length, remove, range, filter, equals, contains} from 'ramda'
import {makeDeSimoneNode, updateNode} from './specs/DeSimoneNode'
import ENUM from './Enum';

/**
 * Normalize a regular expression, removing external parentesis
 * and setting '.' between terminals.
 * @param {expr} expr - Expression to be normalized.
 * @return {string} - The expression normalized.
*/
function normalize(expr) {
  let regExp = clone(expr);
  let str = clone(regExp);
  const alph = uniq(filter(s => !equals(s, '(') &&
                           !equals(s, ')') &&
                           !equals(s, '|') &&
                           !equals(s, '+') &&
                           !equals(s, '?') &&
                           !equals(s, '.') &&
                           !equals(s, '*'), str));
  if (length(str) === 0) {
    return;
  }
  let i;
  let pair;
  let pos = 0;
  for (i in range(0, length(regExp))) {
    pair = (regExp.substring(i, i+2)).split("");

    if  ( contains(pair[0], alph) && contains(pair[1], alph) ||
        ( contains(pair[0], alph) && pair[1] === '(' ) ||
        ( pair[0] === ')' && contains(pair[1], alph)) ||
        ( pair[0] === '*' && contains(pair[1], alph)) ||
        ( pair[0] === '?' && contains(pair[1], alph)) ||
        ( pair[0] === '*' && pair[1] === '(' ) ||
        ( pair[0] === '?' && pair[1] === '(' ) ||
        ( pair[0] === ')' && pair[1] === '(')) {
          str = str.substr(0, pos+1) + '.' + str.substr(pos+1, length(str));
          pos = pos + 1;
        }

    pos = pos+1;
  }
  regExp = str;
  while ( regExp[0] === '(' && regExp[subtract(length(regExp), 1)] === ')'  && equals(lessSignificant(regExp), ['&',-1])) {
    regExp = regExp.substr(1,subtract(length(regExp), 2));
  }
  return regExp;
}

/**
 * Get the less significant property from the expression
 * @param {expr} expr - The expression to be analysed.
 * @return {array<Object>} - The less significant property from the expression
 * and its index.
*/
function lessSignificant(expr) {
  let lvl = 0;
  let lSignificant = ['&', -1];
  let i;
  for (i in range(0, length(expr))) {
    let elem = expr[i];
    if (elem === '(') {
      lvl = lvl+1;
    } else if (elem === ')') {
      lvl = lvl-1
    } else if (lvl === 0) {
        if (elem === '|' && lSignificant[0] != '|') {
          lSignificant = ['|', i];
        } else if (elem === '.' && !contains(lSignificant[0], ['|', '.'])) {
          lSignificant = ['.', i];
        } else if (elem === '*' && !contains(lSignificant[0], ['|', '.', '*'])) {
          lSignificant = ['*', i];
        } else if (elem === '?' && !contains(lSignificant[0], ['|', '.', '*', '?']) ) {
          lSignificant = ['?', i];
        } else if (!contains(lSignificant[0], ['|', '.', '*', '?'])) {
          lSignificant = [elem, i];
        }
    }
  }
  return lSignificant;
}

/**
 * Build the tree with the parent of the root node.
 * @param {expr} expr - The expression that will be the base of the tree construction.
 * @return {array<Object>} - Specified expression's tree.
*/
function deDesimoneTree(expr) {
  const tree = makeTree(expr);
  tree.parent = ENUM.Lambda;
  return tree;
}

/**
 * Build the tree of the specified expression.
 * @param {expr} expr - The expression that will be the base of the tree construction.
 * @return {array<Object>} - Specified expression's tree.
*/
function makeTree(expr) {
  let nExpr = normalize(expr);
  let lsig = lessSignificant(nExpr);
  let node;
  if (length(nExpr) > 1) {
    let left = nExpr.substr(0, lsig[1]);
    let right = nExpr.substr(add(lsig[1], 1), length(nExpr));
    left = makeTree(left);
    right = makeTree(right);
    if (lsig[0] === '|') {
      node = makeDeSimoneNode('|', left,right);
    } else if (lsig[0] === '*') {
      node = makeDeSimoneNode('*', left);
    } else if (lsig[0] === '?') {
      node = makeDeSimoneNode('?', left);
    } else if (lsig[0] === '.') {
      node = makeDeSimoneNode('.', left,right);
    }

    updateNode('parent', left, node);
    updateNode('parent', right, node);
  } else {
    node = makeDeSimoneNode(lsig[0]);
  }
  return node
}

export {
  normalize,
  lessSignificant,
  deDesimoneTree,
}
