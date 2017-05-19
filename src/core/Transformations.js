import { isDeterministic } from './Automata';
import { firstNDTransition } from './Operations';

export function removeBlankTransitions(automata) {
}

export function determineze(automata) {
  if (isDeterministic(automata)) {
    return automata;
  }

  console.log(firstNDTransition(automata.transitions));
}
