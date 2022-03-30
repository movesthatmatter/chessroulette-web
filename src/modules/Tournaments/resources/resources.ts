import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';

export const getAllChallongeTournaments = (
  req: Resources.Util.RequestOf<typeof getAllTournamentsResource>
) => {
  const {
    resource: getAllTournamentsResource,
  } = Resources.Collections.ChallongeTournaments.GetChallongeTournaments;

  return getAllTournamentsResource.request(req, (params) =>
    http.get('api/tournaments/all', { params })
  );
};

export const getTournament = (
  slug: string,
  req: Resources.Util.RequestOf<typeof getTournamentByID>
) => {
  const {
    resource: getTournamentByID,
  } = Resources.Collections.ChallongeTournaments.GetChallongeTournamentById;

  return getTournamentByID.request(req, (params) =>
    http.get(`api/tournaments/show/${slug}`, { params })
  );
};

export const createParticipantForTournament = (
  req: Resources.Util.RequestOf<typeof registerParticipant>
) => {
  const {
    resource: registerParticipant,
  } = Resources.Collections.ChallongeTournaments.CreateChallongeTournamentParticipant;

  return registerParticipant.request(req, (data) => http.post(`api/tournaments/register`, data));
};

export const createTournament = (
  req: Omit<Resources.Util.RequestOf<typeof createTournamentResource>, 'start_at'>
) => {
  const {
    resource: createTournamentResource,
  } = Resources.Collections.ChallongeTournaments.CreateChallongeTournament;

  return createTournamentResource.request(req, (data) => http.post(`api/tournaments/create`, data));
};

export const checkIfUserIsParticipant = (req: Resources.Util.RequestOf<typeof checkUser>) => {
  const {
    resource: checkUser,
  } = Resources.Collections.ChallongeTournaments.CheckIfUserIsParticipant;

  return checkUser.request(req, (params) => http.get('api/tournaments/check-user', { params }));
};

export const getAllMatches = (req: Resources.Util.RequestOf<typeof getMatches>) => {
  const { resource: getMatches } = Resources.Collections.ChallongeTournaments.GetAllMatches;

  return getMatches.request(req, (params) =>
    http.get(`api/tournaments/${params.tournamentId}/matches`)
  );
};

export const joinMatchAsPlayer = (req: Resources.Util.RequestOf<typeof resource>) => {
  const { resource } = Resources.Collections.ChallongeTournaments.JoinMatchAsPlayer;

  return resource.request(req, (data) => http.post('api/tournaments/join-player', data));
};

export const proxy = () => {
  return http.put('api/tournaments/proxy', {
    url: 'tournaments/10976866/matches/270733840',
    data: {
      'match[scores_csv]': '1-0',
      'match[winner_id]': '167865510',
    },
  });
};
