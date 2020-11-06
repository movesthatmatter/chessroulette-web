export const toChessColor = (c: 'w' | 'white' | 'b' | 'black') => {
  return c === 'b' || c === 'black'
    ? 'black'
    : 'white';
}