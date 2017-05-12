import { where, isEmpty, isNil, complement, __ } from 'ramda';

const specAutomata = automata => {
  return where({
    alphabet: complement(isEmpty(__)),
    states: complement(isEmpty(__)),
    initial: complement(isNil(__)),
    finals: complement(isEmpty(__))
  })(automata);
}

export function makeAutomata(alphabet, states, initial, finals) {
  const automata = {
    alphabet: alphabet,
    states: states,
    initial: initial,
    finals: finals
  };

  return specAutomata(automata) ? automata : {}
}
