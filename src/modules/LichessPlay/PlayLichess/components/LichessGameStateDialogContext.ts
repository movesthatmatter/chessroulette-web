import { createContext } from "react";
import { LichessChallenge, LichessGameFull } from "../../types";

export type LichessGameDialogContext = {
  state : 'started' | 'finished' | 'resign' | 'draw' | 'mate' | 'pending'
  challenge : LichessChallenge | undefined;
  game : LichessGameFull | undefined;
} | undefined;

export const lichessGameStateContext = createContext<LichessGameDialogContext>(undefined);