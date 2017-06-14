import { reduce, map, assoc, isEmpty, prepend } from 'ramda';
import { withErrorTransitions, findTransition } from '../../core/Operations';

const toColumns = (automata) => (
  prepend({
    title: 'State',
    dataIndex: 'state',
    key: 'state',
  }, map((sym) => (
    {
      title: sym,
      dataIndex: sym,
      key: sym,
    }), automata.alphabet || [])
));

const toSourceData = (automata) => {
  if (isEmpty(automata)) { return {}; }

  const withError = withErrorTransitions(automata);

  return map((state) => (
    reduce((data, sym) => (
      assoc(sym, findTransition(withError, state, sym).next, data)
    ), { state: state }, automata.alphabet)
  ), automata.states)
};

export {
  toColumns,
  toSourceData
};
