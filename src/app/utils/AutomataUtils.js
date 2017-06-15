import { reduce, map, assoc, isEmpty, prepend, cond, T, equals, contains } from 'ramda';
import { withErrorTransitions, findTransition } from '../../core/Operations';

const toColumns = (automata) => (
  prepend({
    title: 'State',
    dataIndex: 'state',
    key: 'state',
    render: s => s.text,
  }, map((sym) => (
    {
      title: sym,
      dataIndex: sym,
      key: sym,
      render: s => s.text,
    }), automata.alphabet || [])
));

const parseState = (state, automata) => {
  const isFinal = s => contains(s, automata.finals);
  const isInitial = s => equals(s, automata.initial);

  return cond([
    [s => isFinal(s) && isInitial(s), s => '-> * ' + s],
    [isFinal, s => '* ' + s],
    [isInitial, s => '-> ' + s],
    [T, s => s],
  ])(state)
};

const toSourceData = (automata) => {
  if (isEmpty(automata)) { return {}; }

  const withError = withErrorTransitions(automata);

  let counter = 0;
  return map((state) => {
    const data = reduce((data, sym) => (
      assoc(sym, {
        text: findTransition(withError, state, sym).next,
        value: sym
      }, data)
    ), {
      state: {
        state: state,
        text: parseState(state, automata)
      }
    }, automata.alphabet);

    return assoc('key', counter++, data);
  }, automata.states)
};

export {
  toColumns,
  toSourceData
};
