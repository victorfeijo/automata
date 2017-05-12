import { where, isEmpty, isNil, complement, __ } from 'ramda';

const specAutomata = automata => (
  where({
    alphabet: complement(isEmpty(__)),
    transitions: complement(isEmpty(__)),
    initial: complement(isNil(__)),
    finals: complement(isEmpty(__)),
  })(automata)
);

export default function makeAutomata(alphabet, transitions, initial, finals) {
  const automata = {
    alphabet,
    transitions,
    initial,
    finals,
  };

  return specAutomata(automata) ? automata : {};
}
