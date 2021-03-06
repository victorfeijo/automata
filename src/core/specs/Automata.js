import { where, all, any, pluck, gte, length, propEq, __ } from 'ramda';
import { isString, isStringList, isSEList } from '../Predicates';
import ENUM from '../Enum';

const specTransition = transition => (
  where({
    state: isString(__),
    value: isString(__),
    next: isStringList(__),
  })(transition)
);

const specAutomata = automata => (
  where({
    states: isStringList(__),
    alphabet: isStringList(__),
    transitions: all(specTransition(__))(__),
    initial: isString(__),
    finals: isSEList(__),
  })(automata)
);

export default function makeAutomata(states, alphabet, transitions, initial, finals) {
  const automata = {
    states,
    alphabet,
    transitions,
    initial,
    finals,
  };

  return specAutomata(automata) ? automata : {};
}

export const isBlankTransition = transition => (
  propEq('value', ENUM.Epsilon)(transition)
);

export const hasBlankTransitions = automata => (
  any(isBlankTransition(__))(automata.transitions)
);

export const isDeterministic = automata => (
  !(hasBlankTransitions(automata) ||
    any(next => gte(length(next), 2))(
      pluck('next', automata.transitions),
    )
  )
);

export const errorTransition = (state, value) => ({
  state,
  value,
  next: [ENUM.Error],
});
