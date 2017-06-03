import {add, subtract, uniq, clone, length, remove, range, filter, equals, contains} from 'ramda'


function normalize(expr) {
  let regExp = clone(expr);
  let str = clone(regExp);
  const alph = uniq(filter(s => !equals(s, '(') &&
                           !equals(s, ')') &&
                           !equals(s, '|') &&
                           !equals(s, '+') &&
                           !equals(s, '?') &&
                           !equals(s, '.') &&
                           !equals(s, '*'), str));
  // console.log(alph);
  if (length(str) === 0) {
    return;
  }
  let i;
  let pair;
  let pos = 0;
  for (i in range(0, length(regExp))) {
    pair = (regExp.substring(i, i+2)).split("");
    // console.log(pair);

    if  ( contains(pair[0], alph) && contains(pair[1], alph) ||
        ( contains(pair[0], alph) && pair[1] === '(' ) ||
        ( pair[0] === ')' && contains(pair[1], alph)) ||
        ( pair[0] === '*' && contains(pair[1], alph)) ||
        ( pair[0] === '?' && contains(pair[1], alph)) ||
        ( pair[0] === '*' && pair[1] === '(' ) ||
        ( pair[0] === '?' && pair[1] === '(' ) ||
        ( pair[0] === ')' && pair[1] === '(')) {
          str = str.substr(0, pos+1) + '.' + str.substr(pos+1, length(str));
          pos = pos + 1;
          // console.log(str);
        }

    pos = pos+1;
  }
  regExp = str;
  while ( regExp[0] === '(' && regExp[subtract(length(regExp), 1)] === ')' ) {
            // (less_significant() == ('&',-1) ):
    regExp = regExp.substr(1,subtract(length(regExp), 2));
  }
  return regExp;
}

function lessSignificant(expr) {
  let lvl = 0;
  let lSignificant = ['&', -1];
  let i;
  for (i in range(0, length(expr))) {
    let elem = expr[i];
    if (elem === '(') {
      lvl = lvl+1;
    } else if (elem === ')') {
      lvl = lvl-1
    } else if (lvl === 0) {
        if (elem === '|' && lSignificant[0] != '|') {
          lSignificant = ['|', i];
        } else if (elem === '.' && !contains(lSignificant[0], ['|', '.'])) {
          lSignificant = ['.', i];
        } else if (elem === '*' && !contains(lSignificant[0], ['|', '.', '*'])) {
          lSignificant = ['*', i];
        } else if (elem === '?' && !contains(lSignificant[0], ['|', '.', '*', '?']) ) {
          lSignificant = ['?', i];
        } else if (!contains(lSignificant[0], ['|', '.', '*', '?'])) {
          lSignificant = [elem, i];
        }
    }
  }
  return lSignificant;
}

function deDesimoneTree(expr) {
  let nExpr = normalize(expr);
  let lsig = lessSignificant(nExpr);
  console.log(lsig);
  let node;
  if (length(expr) > 1) {
    let left = nExpr.substr(0, lsig[1]);
    let right = nExpr.substr(add(lsig[1], 1), length(nExpr));

    // left =;
    // right =;
    // if (lsig === '|') {
    //
    // } else if (lsig === '*') {
    //
    // } else if (lsig === '?') {
    //
    // } else if (lsig === '.') {
    //
    // }
  }
}

export {
  normalize,
  lessSignificant,
  deDesimoneTree,
}
