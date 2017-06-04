import {assoc, and, find, any, all, pluck, add, subtract, uniq, clone, length, remove, range, filter, equals, contains, drop, head, without, propEq, flatten, reduce, union, map, isEmpty } from 'ramda'
import makeDeSimoneNode, { updateNode, downMove, upMove } from './specs/DeSimoneNode';
import makeAutomata from './specs/Automata';
import { rangeStates } from './Utils';
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

/**
 * Find deSimoneState with the same composition.
 * @param {array<object>} deSimoneStates - State to look.
 * @param {array<deSimoneNode>} composition - Node composition to compare.
 * @return {object} - Found DeSimoneState.
 */
const findByComposition = (deSimoneStates, composition) => (
  find(tran => (
    and(
      all(comp => contains(comp, tran.composedBy), composition),
      all(comp => contains(comp, composition), tran.composedBy),
    )
  ), deSimoneStates)
);

const deSimoneStatesAlphabet = (deSimoneStates) => (
  reduce((acc, state) => (
    union(acc, head(state.transitions).alphabet)
  ), [], deSimoneStates)
);

/**
 * Create deSimoneState trasntitions based on composition.
 * @param {string} state - State to create.
 * @param {array<deSimoneNode>} composition - Nodes composition.
 * @param {array<string>} stateList - List of remaining states to create.
 * @return {array<objcet>} - Collection of DeSimoneState transitions.
 */
const createCompTransitions = (state, composition, stateList) => {
  const alphabet = reduce((acc, node) => (
    (!equals(node, ENUM.Lambda)) ? union(acc, node.symbol) : acc
  ), [], composition);

  return map(sym => {
    const newNext = stateList.shift();

    return {
      transition: { state: state, value: sym, next: [newNext] },
      nextCreate: {
        state: newNext,
        composition: filter(propEq('symbol', sym), composition)
      },
      alphabet: alphabet
    }
  }, alphabet);
};

/**
 * Update next transitions of DeSimoneStates.
 * @param {array<objcet>} deSimoneStates - DeSimoneNode tree root.
 * @param {string} oldState - state to be replaced.
 * @param {string} newState - new state.
 * @return {array<object>} - Collection of updated DeSimoneStates.
 */
const updateNextTransitions = (deSimoneStates, oldState, newState) => (
  map(state => (
    assoc('transitions', map(compTran => {
      if (equals(compTran.transition.next, [oldState])) {
        return {
          transition: assoc('next', [newState], compTran.transition),
          nextCreate: compTran.nextCreate,
        };
      }
      return compTran;
    }, state.transitions), state)
  ), deSimoneStates)
);

/**
 * Recursive function to create deSimoneStates.
 * The date structure used to create transitions contains
 * state, transitions and deSimone composition.
 * @param {array<object>} createdStates - Already created DeSimoneNodeStates.
 * @param {array<object>} toCreate - DeSimoneStates left to create.
 * @param {array<string>} stateList - List of reamining states to create.
 * @return {DeSimoneStates} - Equivalent states.
 */
function deSimoneStates(createdStates, toCreate, stateList) {
  if (isEmpty(toCreate)) {
    return createdStates;
  }

  const nextTransitions = reduce((acc, stateComp) => {
    const composition = reduce((acc, node) => (
      union(flatten(upMove(node)), acc)
    ), [], stateComp.composition);

    const existentComp = findByComposition(createdStates, composition);
    if (existentComp) {
      createdStates = updateNextTransitions(createdStates, stateComp.state, existentComp.state);
      return acc;
    }

    return union(acc, [{
      state: stateComp.state,
      transitions: createCompTransitions(stateComp.state, composition, stateList),
      composedBy: composition
    }]);
  }, [], toCreate);

  const newToCreate = reduce((acc, toCreate) => (
    union(acc, map(t => t.nextCreate, toCreate.transitions))
  ), [], nextTransitions);

  return deSimoneStates(
    [...createdStates, ...nextTransitions],
    newToCreate,
    stateList
  );
}

/**
 * Transform deSimone tree to Finite State Automata.
 * @param {DeSimoneNode} deSimoneNode - DeSimoneNode tree root.
 * @return {Automata} - Equivalent automata.
 */
function deSimoneToAutomata(deSimoneRoot) {
  const initialComposition = flatten(downMove(deSimoneRoot));

  const stateList = rangeStates();
  const initialState = stateList.shift();

  const initialDeSimoneState = {
    state: initialState,
    transitions: createCompTransitions(initialState, initialComposition, stateList),
    composedBy: initialComposition
  };

  const deSimoneAutomata = deSimoneStates(
    [initialDeSimoneState],
    pluck('nextCreate', initialDeSimoneState.transitions),
    stateList
  );

  return makeAutomata(
    pluck('state', deSimoneAutomata),
    deSimoneStatesAlphabet(deSimoneAutomata),
    reduce((acc, state) =>
      union(acc, pluck('transition', state.transitions)), [], deSimoneAutomata),
    initialState,
    pluck('state', filter(state =>
      contains(ENUM.Lambda, state.composedBy), deSimoneAutomata))
  );
}

export {
  normalize,
  lessSignificant,
  deDesimoneTree,
  deSimoneToAutomata,
}
