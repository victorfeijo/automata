import makeDeSimoneNode from '../src/core/specs/DeSimoneNode';

const leaf1 = makeDeSimoneNode('a');
const leaf2 = makeDeSimoneNode('b');
const leaf3 = makeDeSimoneNode('c');
const concatNode = makeDeSimoneNode( '.', leaf2, leaf3);
const orNode = makeDeSimoneNode('|', leaf1, concatNode);

export const root1 = makeDeSimoneNode('*', orNode);
