import { isNil, isEmpty, contains, find,
         propEq, tail, head, filter, any } from 'ramda';
import { errorTransition } from './Automata';

export const findTransition = (transitions, state, value) => (
  (find(propEq('value', value))(
    filter(propEq('state', state), transitions),
  ) || errorTransition)
);

const verifyTape = (actual, transitions, finals, left) => {
  if (isNil(actual) || isEmpty(left)) {
    return contains(actual, finals);
  }

  const actualTransition = findTransition(transitions, actual, head(left));

  return any(next => verifyTape(next, transitions, finals, tail(left)),
             actualTransition.next);
};

export function readTape(automata, tape) {
  return verifyTape(automata.initial,
                    automata.transitions,
                    automata.finals,
                    tape.values);
}
