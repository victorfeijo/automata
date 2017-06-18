import { reduce, map, assoc, isEmpty, prepend, pluck, union, concat, gte,
         cond, T, equals, contains, without, keys, prop, filter, toString, length, trim, split, join } from 'ramda';
import { withErrorTransitions, findTransition, alphabetWithBlank } from '../../core/Operations';
import { determineze, distinguishStates, removeBlankTransitions,
         removeUnreachables, removeDeads, removeEquivalent } from '../../core/Transformations';
import { complementAutomata, joinAutomatas } from '../../core/Relations';
import { renameStates } from '../../core/Utils';
import ENUM from '../../core/Enum';
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
    }), isEmpty(automata) ? [] : alphabetWithBlank(automata))
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

const nextToND = (nextString) => (
  split(',', trim(nextString))
);

const nextToString = next => (
  join(', ', next)
);

const toSourceData = automata => {
  if (isEmpty(automata)) { return {}; }

  const withError = withErrorTransitions(automata);
  const orderedStates = prepend(
    automata.initial,
    without([automata.initial], automata.states)
  );

  let counter = 0;
  return map((state) => {
    const data = reduce((data, sym) => (
      assoc(sym, {
        text: nextToString(findTransition(withError, state, sym).next),
        next: findTransition(withError, state, sym).next,
        value: sym,
      }, data)
    ), {
      state: {
        state: state,
        text: parseState(state, automata),
        final: contains(state, automata.finals),
      }
    }, alphabetWithBlank(automata));

    return assoc('key', counter++, data);
  }, orderedStates);
};

const sourceDataToAutomata = sourceData => {
  const alphabet = without(['state', 'key'], keys(sourceData[0]));
  const states = pluck('state', pluck('state', sourceData));

  const transitions = reduce((acc, data) => (
    union(acc, map(sym => (
      {
        state: data.state.state,
        value: sym,
        next: prop(sym, data).next
      }
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

function joinWithParcials(automataA, automataB) {
  const distinguishA = distinguishStates(automataA, 'A');
  const distinguishB = distinguishStates(automataB, 'B');

  const newInitialTransition = {
    state: concat(distinguishA.initial, distinguishB.initial),
    value: ENUM.Epsilon,
    next: [distinguishA.initial, distinguishB.initial]
  };

  const joined = makeAutomata(
    union([newInitialTransition.state],
      union(distinguishA.states, distinguishB.states)),
    union(distinguishA.alphabet, distinguishB.alphabet),
    union([newInitialTransition],
      union(distinguishA.transitions, distinguishB.transitions)),
    newInitialTransition.state,
    union(distinguishA.finals, distinguishB.finals)
  );
  const withoutBlank = removeBlankTransitions(joined);
  const renamed = renameStates(withoutBlank);
  const determinized = determineze(renamed);

  return [
    { operation: 'Distinguish A', automata: distinguishA },
    { operation: 'Distinguish B', automata: distinguishB },
    { operation: 'Joined', automata: joined },
    { operation: 'Remove blank', automata: withoutBlank },
    { operation: 'Rename states', automata: renamed },
    { operation: 'Determinized', automata: determinized },
  ];
}

function intersectionWithParcials(automataA, automataB) {
  const complementA = complementAutomata(automataA);
  const complementB = complementAutomata(automataB);
  const joined = joinAutomatas(complementA, complementB);
  const intersect = complementAutomata(joined);

  return [
    { operation: 'Complement A', automata: complementA },
    { operation: 'Complement B', automata: complementB },
    { operation: 'Joined', automata: joined },
    { operation: 'Intersection', automata: intersect },
  ];
}

function differenceWithParcials(automataA, automataB) {
  const complementA = complementAutomata(automataA);
  const joined = joinAutomatas(complementA, automataB);
  const intersect = complementAutomata(joined);

  return [
    { operation: 'Complement A', automata: complementA },
    { operation: 'Joined', automata: joined },
    { operation: 'Difference', automata: intersect },
  ];
}

function complementWithParcials(automata) {
  const withoutBlank = removeBlankTransitions(automata);
  const determinized = determineze(withoutBlank);
  const complement = complementAutomata(determinized);

  return [
    { operation: 'Without blank', automata: withoutBlank },
    { operation: 'Determinized', automata: determinized },
    { operation: 'Complement', automata: complement },
  ];
}

function determinizeWithParcials(automata) {
  return [
    { operation: 'Determinize', automata: determineze(automata) },
  ]
}

function minimizeWithParcials(automata) {
  const reachable = removeUnreachables(automata);
  const live = removeDeads(reachable);
  const noEquivalent = removeEquivalent(live);

  return [
    { operation: 'Remove unreachables', automata: reachable },
    { operation: 'Remove dead states', automata: live },
    { operation: 'Remove equivalents', automata: noEquivalent },
  ]
}

export {
  nextToND,
  toColumns,
  toSourceData,
  sourceDataToAutomata,
  joinWithParcials,
  intersectionWithParcials,
  differenceWithParcials,
  complementWithParcials,
  determinizeWithParcials,
  minimizeWithParcials,
};
