import { ChessGameStateFen, ChessMove, GameRecord, toResult } from 'dstnd-io';
import { http } from 'src/lib/http';
import { AsyncResult, AsyncResultWrapper } from 'ts-async-results';
import * as io from 'io-ts';
import { useEffect, useState } from 'react';
import { pgnToFen } from '../../lib';
import { keyInObject } from 'src/lib/util';
import { EngineAnalysisRecord } from './types';
import { processEngineLines } from './util';

const engineAnalysisPayload = io.type({
  bestmove: io.string,
  ponder: io.string,
  info: io.array(io.UnknownRecord),
});

const fetchAnalyze = (p: { fen: ChessGameStateFen; gameId: string }) => {
  return new AsyncResultWrapper(async () => {
    const { data } = await http.post(`/api/engine/analyze`, p);

    return toResult(engineAnalysisPayload.decode(data))
      .map((engineRes) => ({
        bestMove:
          engineRes.bestmove !== '(none)'
            ? ({
                from: engineRes.bestmove.slice(0, 2),
                to: engineRes.bestmove.slice(2, 4),
                san: engineRes.bestmove.slice(2, 4),
              } as ChessMove)
            : undefined,
        // TODO: does ponder come with (none) as well?
        ...(engineRes.ponder !== '(none)'
          ? {
              ponderMove: {
                from: engineRes.ponder.slice(0, 2),
                to: engineRes.ponder.slice(2, 4),
                san: engineRes.ponder.slice(2, 4),
              } as ChessMove,
            }
          : undefined),
        info: engineRes.info.map((l) => {
          if (keyInObject(l, 'depth') && keyInObject(l, 'pv') && keyInObject(l, 'score')) {
            return {
              type: 'depthLine',
              ...l,
            };
          }

          return {
            type: 'other',
            ...l,
          };
        }) as EngineAnalysisRecord['info'],
      }))
      .map((r) => ({
        ...r,
        info: processEngineLines(r.info),
      }));
  });
};

export type EngineAnalysisState = {
  evaluation: EngineAnalysisRecord | undefined;
  isLoading: boolean;
};

export const useEngineAnalysis = (game?: Pick<GameRecord, 'id' | 'pgn'>) => {
  const [state, setState] = useState<EngineAnalysisState>({
    evaluation: undefined,
    isLoading: false,
  });

  useEffect(() => {
    if (!game?.pgn) {
      setState({
        evaluation: undefined,
        isLoading: false,
      });
      return;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    fetchAnalyze({ fen: pgnToFen(game.pgn), gameId: game.id })
      .map(
        AsyncResult.passThrough((evaluation) => {
          setState({
            evaluation,
            isLoading: false,
          });
        })
      )
      .mapErr(
        AsyncResult.passThrough(() => {
          setState({
            evaluation: undefined,
            isLoading: false,
          });
        })
      );
  }, [game?.pgn]);

  return state;
};
