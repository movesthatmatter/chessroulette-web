import { ChessAnalyisHistory } from '../analysisHistory';

export const printHistory = (h: ChessAnalyisHistory, baseIndex: number = 0) => {
  console.group('Printing  History:');
  h.forEach((m, i) => {
    const index = baseIndex + i;
    console.log('move', `${Math.floor(index / 2) + 1}.${index % 2 === 0 ? 'w' : 'b'}`, m.san);
    if (m.branchedHistories) {
      console.log('branches', m.branchedHistories);
      m.branchedHistories.forEach((branchedHistory) => {
        printHistory(branchedHistory, index + 1);
      });
    }
  });
  console.groupEnd();

  console.log(JSON.stringify(h, null, 2));
};
