import { isEmpty, contains, find, propEq, tail, head, filter } from 'ramda';

export const findTransition = (transitions, state, value) => (
  find(propEq('value', value))(
    filter(propEq('state', state), transitions),
  )
);

const verifyTape = (actual, transitions, finals, left) => {
  if (isEmpty(left)) {
    return contains(actual, finals);
  }

  const actualTransition = findTransition(transitions, actual, head(left));

  return verifyTape(actualTransition.next[0], transitions, finals, tail(left));
};

export function acceptTape(automata, tape) {
  return verifyTape(automata.initial,
                    automata.transitions,
                    automata.finals,
                    tape.values);
}
