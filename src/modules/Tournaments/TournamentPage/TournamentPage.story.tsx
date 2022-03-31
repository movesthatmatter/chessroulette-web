import React, { useState } from 'react';
import { TournamentWithFullDetailsMocker } from '../mocks/TournamentWithFullDetailsMocker';
import { TournamentWithFullDetailsRecord } from '../types';
import { TournamentPage } from './TournamentPage';

export default {
	component: TournamentPage,
	title: 'modules/Tournamnets/TournamentPage',
};

const tournamentMocker = new TournamentWithFullDetailsMocker();

export const openTournament = () =>
	React.createElement(() => {
		const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
			tournamentMocker.withLiveGame(6)
		);

		return <TournamentPage tournament={tournament} />;
	});
