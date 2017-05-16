import { d_automata3 } from '../samples/Deterministic';
import { nd_automata1 } from '../samples/NonDeterministic';
import { determineze } from '../src/core/Transformations';

describe('Transform NDAF to DAF', () => {
  test('Already is deterministic', () => {
    expect(determineze(d_automata3)).toEqual(d_automata3);
  });

  test('Valid transformation', () => {
    expect(determineze(nd_automata1)).toEqual(d_automata3);
  });
});
