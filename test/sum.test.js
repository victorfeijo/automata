import makeAdd from '../src/core/sum.js';

test('it returns a curryed function', () => {
  expect(makeAdd(1)).toBeDefined();
});

test('adds 1 + 2 to equal 3', () => {
  expect(makeAdd(1)(2)).toBe(3);
});
