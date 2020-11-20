import validMoveSound from './valid_move.wav';
import inCheckSound from './in_check.wav';
import checkMatedSound from './check_mated.wav';
import gameStartedSound from './game_started.wav';

export const sounds = {
  validMoveAudio: new Audio(validMoveSound),
  inCheckAudio: new Audio(inCheckSound),
  checkMatedAudio: new Audio(checkMatedSound),
  gameStarted: new Audio(gameStartedSound),
};
