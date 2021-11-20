// import { parse } from '@mliebelt/pgn-parser';
import { ParseTree } from '@mliebelt/pgn-parser/lib/types'
import { console } from 'window-or-global'

type ParsedGamesCollection = {
  tags: {
    [k: string] : string;
  };
  moves: {
    [k: string] : string;
  }
}

export const parsePGNGamesFromExternalAPI = (value: string) => {
  // const games: ParseTree[] = parse(value, {startRule: 'games'}) as ParseTree[];
  // games.forEach(game => console.log('next game', game))
}