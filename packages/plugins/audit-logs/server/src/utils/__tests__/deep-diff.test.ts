import deepDiff from '../deep-diff';

describe('deepDiff util', () => {
  test('returns null when no change', () => {
    const a = { x: 1, y: { z: 2 } };
    const b = { x: 1, y: { z: 2 } };
    expect(deepDiff(a, b)).toEqual({});
  });

  test('detects shallow change', () => {
    const a = { x: 1 };
    const b = { x: 2 };
    expect(deepDiff(a, b)).toEqual({ x: { before: 1, after: 2 } });
  });

  test('detects nested change', () => {
    const a = { x: { y: 1 }, arr: [1, 2] };
    const b = { x: { y: 2 }, arr: [1, 2, 3] };
    expect(deepDiff(a, b)).toEqual({ x: { y: { before: 1, after: 2 } }, arr: { before: [1, 2], after: [1, 2, 3] } });
  });

  test('handles non-object values', () => {
    expect(deepDiff(1, 2)).toEqual({ before: 1, after: 2 });
    expect(deepDiff(null, { a: 1 })).toEqual({ before: null, after: { a: 1 } });
  });
});
