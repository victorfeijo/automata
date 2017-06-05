import { split, where, __ } from 'ramda';
import { isStringList } from '../Predicates';

const specTape = tape => (
  where({
    values: isStringList(__),
  })(tape)
);

export default function makeTape(word) {
  const tape = { values: split('', word) };

  return specTape(tape) ? tape : {};
}
