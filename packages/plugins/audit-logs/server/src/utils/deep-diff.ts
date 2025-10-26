// Simple deep diff utility that returns an object with changed keys and their before/after values.
const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

const deepDiff = (before: any, after: any): any => {
  // If either is not an object or arrays differ, return full after
  if (!isObject(before) || !isObject(after)) {
    if (JSON.stringify(before) === JSON.stringify(after)) return null;
    return { before, after };
  }

  const diff: any = {};

  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);

  keys.forEach((key) => {
    const a = before?.[key];
    const b = after?.[key];

    if (isObject(a) && isObject(b)) {
      const nested = deepDiff(a, b);
      if (nested && Object.keys(nested).length > 0) {
        diff[key] = nested;
      }
    } else if (Array.isArray(a) || Array.isArray(b)) {
      // simple array compare
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        diff[key] = { before: a, after: b };
      }
    } else {
      if (JSON.stringify(a) !== JSON.stringify(b)) {
        diff[key] = { before: a, after: b };
      }
    }
  });

  return diff;
};

export default deepDiff;
