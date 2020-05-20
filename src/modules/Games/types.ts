import { ChessPlayer } from './Chess';

export type AvailableGames = {
  chess: ChessPlayer;
}

export type Player<GameType extends keyof AvailableGames> = {
  gameType: keyof AvailableGames;
  info: AvailableGames[GameType];
}
