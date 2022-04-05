import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

export const getAllTournaments = (
  req: Resources.Util.RequestOf<typeof getAllTournamentsResource>
) => {
  const { resource: getAllTournamentsResource } =
    Resources.Collections.Tournaments.GetAllTournaments;

  return getAllTournamentsResource.request(req, (params) =>
    http.get('api/tournaments/all', { params })
  );
};

export const getTournament = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Tournaments.GetTournament;

  return resource.request(req, (params) =>
    http.get(`api/tournaments/show/${params.tournamentId}`, { params })
  );
};

export const getTournamentWithFullDetails = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Tournaments.GetTournamentWithFullDetails;

  return resource.request(req, (params) =>
    http.get(`api/tournaments/show/${params.tournamentId}/full-details`, { params })
  );
};

export const createTournamentParticipant = (
  req: Resources.Util.RequestOf<typeof registerParticipant>
) => {
  const { resource: registerParticipant } =
    Resources.Collections.Tournaments.CreateTournamentParticipant;

  return registerParticipant.request(req, (data) => http.post(`api/tournaments/register`, data));
};

export const createTournament = (
  req: Omit<Resources.Util.RequestOf<typeof createTournamentResource>, 'start_at'>
) => {
  const { resource: createTournamentResource } = Resources.Collections.Tournaments.CreateTournament;

  return createTournamentResource.request(req, (data) => http.post(`api/tournaments/create`, data));
};

export const getAllMatches = (req: Resources.Util.RequestOf<typeof getMatches>) => {
  const { resource: getMatches } = Resources.Collections.Tournaments.GetAllTournamentMatches;

  return getMatches.request(req, (params) =>
    http.get(`api/tournaments/${params.tournamentId}/matches`)
  );
};

export const playTournamentMatch = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.Tournaments.PlayTournamentMatch;

  return resource.request(req, (data) => http.post('api/tournaments/join-player', data));
};
