import { isNil, isEmpty, contains, find,
         propEq, tail, head, filter, any,
         gte, length } from 'ramda';
import { errorTransition } from './Automata';

export const findTransition = (transitions, state, value) => (
  (find(propEq('value', value))(
    filter(propEq('state', state), transitions),
  ) || errorTransition)
);

export const firstNDTransition = transitions => (
  find(tran => gte(length(tran.next), 2))(transitions)
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
