import React from 'react';

type RenderKeyType = boolean | string | number;
type RenderValueType = () => React.ReactNode;
type RenderKeyValuePair = [RenderKeyType, RenderValueType];
export const renderMatch = <T extends [...RenderKeyValuePair[]]>(
  _default: RenderValueType,
  ...cases: T
): React.ReactNode => {
  const matchedPair = cases.find((c) => c[0] === true);

  if (matchedPair) {
    return matchedPair[1]();
  }

  return _default();
};
