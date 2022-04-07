import { AuthenticationToken, RegisteredUserRecord } from 'chessroulette-io';
import React, { useState } from 'react';
import { CombinedState } from 'redux';
import { Button } from 'src/components/Button';
import { TextInput } from 'src/components/TextInput';
import { UserRecordMocker } from 'src/mocks/records';
import { RootState } from 'src/redux/rootReducer';
import { useAuthentication } from 'src/services/Authentication';
import { StorybookBaseProvider } from 'src/storybook/StorybookBaseProvider';
import { StorybookReduxProvider } from 'src/storybook/StorybookReduxProvider';
import { StorybookThemeProvider } from 'src/storybook/StorybookThemeProvider';
import { TournamentWithFullDetailsMocker } from '../mocks/TournamentWithFullDetailsMocker';
import { TournamentWithFullDetailsRecord } from '../types';
import { TournamentPage } from './TournamentPage';

export default {
	component: TournamentPage,
	title: 'modules/Tournamnets/TournamentPage',
};

const tournamentMocker = new TournamentWithFullDetailsMocker();
const myUser = new UserRecordMocker().record() as unknown as RegisteredUserRecord;

export const openTournament = () =>
	React.createElement(() => {
		const [numberParticipants, setNumberParticipants] = useState(0);
		const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
			tournamentMocker.started(6)
		);
		const reconfigureTournament = () => {
			setTournament(tournamentMocker.started(numberParticipants));
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

export const openWithLiveGame = () =>
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

const initialState: Partial<RootState> = {
	authentication: {
		authenticationType: 'user',
		authenticationToken: 'token' as AuthenticationToken,
		user: myUser,
	},
};

export const openWithUnderwayGame = () => (
	<StorybookReduxProvider
		initialState={initialState}
		children={React.createElement(() => {
			const auth = useAuthentication();
			const [numberParticipants, setNumberParticipants] = useState(0);
			const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
				tournamentMocker.withUnderwayGame(6)
			);
			const reconfigureTournament = () => {
				setTournament(tournamentMocker.withUnderwayGame(numberParticipants));
			};

			console.log('auth', auth);

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
		})}
	/>
);

export const openWithUnderwayGameAndAuthenticatedUser = () => (
	<StorybookReduxProvider
		initialState={initialState}
		children={React.createElement(() => {
			const auth = useAuthentication();
			const [numberParticipants, setNumberParticipants] = useState(0);
			const [tournament, setTournament] = useState<TournamentWithFullDetailsRecord>(
				tournamentMocker.withUnderwayGameAndAuthenticatedUser(6, myUser)
			);
			const reconfigureTournament = () => {
				setTournament(
					tournamentMocker.withUnderwayGameAndAuthenticatedUser(numberParticipants, myUser)
				);
			};

			console.log('auth', auth);

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
		})}
	/>
);

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
