import { __, is, curry, or, and, all, isEmpty, isNil, find } from 'ramda';

export const notNil = curry(v => (
  !isNil(v)
));

export const notEmpty = curry(v => (
  !isEmpty(v)
));

export const isString = curry(v => (
  or(typeof v === 'string', v instanceof String)
));

export const isStringList = curry(v => (
  and(notEmpty(v), all(isString(__))(v))
));

export const isSEList = curry(v => (
  (is(Array, v) && isEmpty(v)) || isStringList(v)
));

export const containsObj = curry((obj, arr) => (
  !isNil(find(o => o === obj, arr))
));
