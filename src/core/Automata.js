import { where, all, __ } from 'ramda';
import { isString, isStringList } from './Predicates';

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
    finals: isStringList(__),
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
