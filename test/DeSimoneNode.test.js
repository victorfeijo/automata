import makeDeSimoneNode, { updateNode, isLeafNode, isOrNode, isConcatNode, isCloseNode, isOptionNode } from '../src/core/specs/DeSimoneNode';
import { root1 } from '../samples/RegularExpression';
import ENUM from '../src/core/Enum';

describe('It makes a DeSimoneNode', () => {
  test('Make correct', () => {
    expect(root1).toEqual({
      symbol: '*',
      left: {
        symbol: '|',
        left: {
          symbol: 'a',
          left: {},
          right: {},
          parent: {},
        },
        right: {
          symbol: '.',
          left: {
            symbol: 'b',
            left: {},
            right: {},
            parent: {}
          },
          right: {
            symbol: 'c',
            left: {},
            right: {},
            parent: {}
          },
          parent: {}
        },
        parent: {}
      },
      right: {},
      parent: {}
    });
  });

  test('Dont create when wrong symbol', () => {
    expect(makeDeSimoneNode(['b'])).toEqual({});
  });

  test('Dont create when wrong left', () => {
    expect(makeDeSimoneNode('b', 'ad')).toEqual({});
  });

  test('Dont create when wrong right', () => {
    expect(makeDeSimoneNode('b', {}, 'ad')).toEqual({});
  });

  test('Dont create when wrong parent', () => {
    expect(makeDeSimoneNode('b', {}, {}, 'ad')).toEqual({});
  });
});

describe('Mutable update deSimoneNode', () => {
  test('Update tree parents', () => {
    const parentUpdater = updateNode('parent');

    parentUpdater(root1, ENUM.Lambda);
    parentUpdater(root1.left.left, root1.left);
    parentUpdater(root1.left.right.left, root1.left.right);
    parentUpdater(root1.left.right.right, root1);

    expect(root1.parent).toEqual(ENUM.Lambda);
    expect(root1.left.left.parent).toEqual(root1.left);
    expect(root1.left.right.left.parent).toEqual(root1.left.right);
    expect(root1.left.right.right.parent).toEqual(root1);
  });

  test('Dont update tree parent', () => {
    const parentUpdater = updateNode('parent');

    parentUpdater(root1.left.left, 'ab');

    expect(root1.left.left.parent).toEqual(root1.left.left.parent);
  });
});

describe('DeSimoneNode type', () => {
  test('Is Leaf Node', () => {
    expect(isLeafNode(root1.left.left)).toBeTruthy();

    expect(isLeafNode(root1.left)).toBeFalsy();
  });

  test('Is Or Node', () => {
    expect(isOrNode(root1.left)).toBeTruthy();

    expect(isOrNode(root1.left.right)).toBeFalsy();
  });

  test('Is Concat Node', () => {
    expect(isConcatNode(root1.left.right)).toBeTruthy();

    expect(isConcatNode(root1.left)).toBeFalsy();
  });

  test('Is Close Node', () => {
    expect(isCloseNode(root1)).toBeTruthy();

    expect(isCloseNode(root1.left)).toBeFalsy();
  });

  test('Is Option Node', () => { expect(isOptionNode(root1.left)).toBeFalsy();
  });
});
