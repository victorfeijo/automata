import makeDeSimoneNode, { updateNode, isLeafNode, isOrNode, isConcatNode, isCloseNode, isOptionNode, upMove, downMove } from '../src/core/specs/DeSimoneNode';
import { root1, root2, root3 } from '../samples/RegularExpression';
import { flatten, contains, union } from 'ramda';
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

  test('Is Option Node', () => {
    expect(isOptionNode(root1.left)).toBeFalsy();
  });
});

describe('DeSimone moves', () => {
  describe('Root2', () => {
    test('Down move - root', () => {
      const rootMoves = flatten(downMove(root2));

      expect(contains([
        root2.left.left,
        root2.right.left.left.left,
        root2.right.right.left,
        ENUM.Lambda
      ], rootMoves));
    });

    test('Up move leaf - 1a', () => {
      const leafMoves = flatten(downMove(root2.left.left));

      expect(contains([
        root2.right.left.left.left,
        root2.right.right.left,
        ENUM.Lambda
      ], leafMoves));
    });

    test('Up move leaf - 2b4b', () => {
      const leafMoves2 = flatten(downMove(root2.left.left));
      const leafMoves4 = flatten(downMove(root2.left.left));
      const joined = union(leafMoves2, leafMoves4);

      expect(contains([
        root2.right.left.left.right,
        ENUM.Lambda
      ], joined));
    });
  });

  describe('Root3', () => {
    test('Down move - root', () => {
      const rootMoves = flatten(downMove(root3));

      expect(contains([
        root3.left.left.left.left,
        root3.left.left.right.left,
        root3.right.left.left,
        ENUM.Lambda,
      ], rootMoves));
    });

    test('Up move leaf - 1a', () => {
      const leafMoves = flatten(downMove(root3.left.left.left.left));

      expect(contains([
        root3.left.left.left.right,
      ], leafMoves));
    });

    test('Up move leaf - 3b7b', () => {
      const leafMoves3 = flatten(downMove(root3.left.left.left));
      const leafMoves7 = flatten(downMove(root3.left.left.left));
      const joined = union(leafMoves3, leafMoves7);

      expect(contains([
        root3.left.left.right.right.left.left.left,
        root3.left.left.right.right.right,
        root3.right.left.right,
      ], joined));
    });

    test('Up move leaf - 2b', () => {
      const leafMoves = flatten(downMove(root3.left.left.left.right));

      expect(contains([
        root3.left.left.left.left,
        root3.left.left.right.left,
        root3.right.left.left,
        ENUM.Lambda,
      ], leafMoves));
    });

    test('Up move leaf - 4a', () => {
      const leafMoves = flatten(downMove(root3.left.left.right.right.left.left.left));

      expect(contains([
        root3.left.left.right.right.left.left.right,
        root3.right.left.left,
        ENUM.Lambda,
      ], leafMoves));
    });
  });
});
