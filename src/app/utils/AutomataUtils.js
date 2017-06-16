import { reduce, map, assoc, isEmpty, prepend, pluck, union,
         cond, T, equals, contains, without, keys, prop, filter } from 'ramda';
import { withErrorTransitions, findTransition } from '../../core/Operations';
import makeAutomata from '../../core/specs/Automata';

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

const toSourceData = automata => {
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
        text: parseState(state, automata),
        final: contains(state, automata.finals),
      }
    }, automata.alphabet);

    return assoc('key', counter++, data);
  }, automata.states)
};

const sourceDataToAutomata = sourceData => {
  const alphabet = without(['state', 'key'], keys(sourceData[0]));
  const states = pluck('state', pluck('state', sourceData));

  const transitions = reduce((acc, data) => (
    union(acc, map(sym => (
      { state: data.state.state, value: sym, next: prop(sym, data).text }
    ), alphabet))
  ), [], sourceData);

  const finals = pluck('state', pluck('state',
    filter(d => d.state.final, sourceData)));

  return makeAutomata(
    states,
    alphabet,
    transitions,
    sourceData[0].state.state,
    finals
  );
}

export {
  toColumns,
  toSourceData,
  sourceDataToAutomata
};
