import { ChessPlayer, RoomMatchActivityRecord } from 'chessroulette-io';
import { Game } from '../../../../Games';
import { RoomActivitySpecifcParticipant } from '../../utilTypes';

export type RoomMatchActivityParticipant = RoomActivitySpecifcParticipant<
	'match',
	{
		isPlayer: true;
		canPlay: boolean;
		materialScore: number;
		color: ChessPlayer['color'];
	}
>;

export type RoomMatchActivityWithGameAndParticipating = Omit<RoomMatchActivityRecord, 'gameId'> & {
	game: Game;
	iamParticipating: true;
	participants: {
		me: RoomMatchActivityParticipant;
		opponent: RoomMatchActivityParticipant;
	};
};

export type RoomMatchParticipantsByColor = {
	black: RoomMatchActivityParticipant;
	white: RoomMatchActivityParticipant;
};

export type RoomMatchActivityWithGameButNotParticipating = Omit<
	RoomMatchActivityRecord,
	'gameId'
> & {
	game: Game;
	iamParticipating: false;
	participants: RoomMatchParticipantsByColor;
};

export type RoomMatchActivityWithGame =
	| RoomMatchActivityWithGameAndParticipating
	| RoomMatchActivityWithGameButNotParticipating;

export type RoomMatchActivity = RoomMatchActivityWithGame;
