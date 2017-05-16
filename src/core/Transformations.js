import { isNonDeterministic } from './Automata';
import { firstNDTransition } from './Operations';

export function determineze(automata) {
  if (!isNonDeterministic(automata)) {
    return automata;
  }

  console.log(firstNDTransition(automata.transitions))
}
