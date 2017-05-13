import { __, curry, or, and, all, isEmpty, isNil } from 'ramda';

export const isString = curry(v => (
  or(typeof v === 'string', v instanceof String)
));

export const isStringList = curry(v => (
  and(notEmpty(v), all(isString(__))(v))
));

export const notNil = curry(v => (
  !isNil(v)
));

export const notEmpty = curry(v => (
  !isEmpty(v)
));
