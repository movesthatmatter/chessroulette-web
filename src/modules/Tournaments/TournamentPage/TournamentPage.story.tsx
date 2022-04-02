import React, { useState } from 'react';
import { Button } from 'src/components/Button';
import { TextInput } from 'src/components/TextInput';
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
		const [numberParticipants, setNumberParticipants] = useState(0);
		const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
			tournamentMocker.withLiveGame(6)
		);
		const reconfigureTournament = () => {
			setTournament(tournamentMocker.withLiveGame(numberParticipants));
		};

		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '20px',
				}}
			>
				<div style={{ display: 'flex', gap: '20px' }}>
					<TextInput
						label="Number Participants"
						onChange={(v) => setNumberParticipants(+v.currentTarget.value)}
						style={{ width: '100px' }}
					/>
					<Button label="Submit" onClick={reconfigureTournament} />
				</div>
				<TournamentPage tournament={tournament} />
			</div>
		);
	});

export const pendingTournament = () =>
	React.createElement(() => {
		const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
			tournamentMocker.pending(6)
		);

		return <TournamentPage tournament={tournament} />;
	});

export const completedTournament = () =>
	React.createElement(() => {
		const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
			tournamentMocker.completed(6)
		);

		return <TournamentPage tournament={tournament} />;
	});
