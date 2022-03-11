import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const {
  resource: getAllTournamentsResource,
} = Resources.Collections.ChallongeTournaments.GetChallongeTournaments;

export const getAllChallongeTournaments = (
  req: Resources.Util.RequestOf<typeof getAllTournamentsResource>
) => {
  return getAllTournamentsResource.request(req, (params) => http.get('api/tournaments/all', { params }));
};

const {
  resource: getTournamentByID,
} = Resources.Collections.ChallongeTournaments.GetChallongeTournamentByID;

export const getTournament = (
  slug: string,
  req: Resources.Util.RequestOf<typeof getTournamentByID>
) => {
  return getTournamentByID.request(req, (params) =>
    http.get(`api/tournaments/show/${slug}`, { params })
  );
};

const {
  resource: registerParticipant,
} = Resources.Collections.ChallongeTournaments.CreateChallongeTournamentParticipant;

export const createParticipantForTournament = (
  req: Resources.Util.RequestOf<typeof registerParticipant>
) => {
  return registerParticipant.request(req, (data) => http.post(`api/tournaments/register`, data));
};

const {
  resource: createTournamentResource,
} = Resources.Collections.ChallongeTournaments.CreateChallongeTournament;

export const createTournament = (
  req: Omit<Resources.Util.RequestOf<typeof createTournamentResource>, 'start_at'>
) => {
  return createTournamentResource.request(req, (data) => http.post(`api/tournaments/create`, data));
};

const { resource: checkUser } = Resources.Collections.ChallongeTournaments.CheckIfUserIsParticipant;

export const checkIfUserIsParticipant = (req: Resources.Util.RequestOf<typeof checkUser>) => {
  return checkUser.request(req, (params) => http.get('api/tournaments/check-user', { params }));
};

const { resource: getMatches } = Resources.Collections.ChallongeTournaments.GetAllMatches;

export const getAllMatches = (req: Resources.Util.RequestOf<typeof getMatches>) => {
  return getMatches.request(req, (params) => http.get('api/tournaments/matches', { params }));
};
