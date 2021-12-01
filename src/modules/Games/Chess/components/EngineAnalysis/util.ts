import { EngineDepthLine, EngineLine } from './types';

// TODO: Add Test
const sortDepthLineWithMateScore = (a: EngineDepthLine, b: EngineDepthLine) => {
  if (a.score.unit === 'mate') {
    // If both are mate return the one with lessamount of moves left (value)
    if (b.score.unit === 'mate') {
      return a.score.value - b.score.value;
    }

    // If only A is mate and the other cp A wins
    return 1; // TODO: not sure 1 or -1
  }

  // If only B is mate and the other cp B wins
  if (b.score.unit === 'mate') {
    return -1; // TODO: not sure 1 or -1
  }

  // Otherwise jsut return based on cp value
  return Math.abs(b.score.value) - Math.abs(a.score.value);
}

export const processEngineLines = (lines: EngineLine[], maxLines = 1) => {
  const onlyDepthLines = lines.filter((l) => l.type === 'depthLine') as EngineDepthLine[];

  return onlyDepthLines.sort(sortDepthLineWithMateScore).slice(-maxLines)
}