import { Resources } from 'chessroulette-io';
import { http } from 'src/lib/http';
import { promiseToAsyncResult } from 'src/lib/utils';

const {resource : getAllTournamentsResource} = Resources.Collections.ChallongeTournaments.GetChallongeTournaments;

export const getAllChallongeTournaments = (
  req: Resources.Util.RequestOf<typeof getAllTournamentsResource>
) => {
  // return getAllTournamentsResource.request(req, (params) => http.get('api/tournaments/all', { params }))
  return promiseToAsyncResult(http.get('api/tournaments/all', { params:req }))
}

const {resource : getTournamentByID} = Resources.Collections.ChallongeTournaments.GetChallongeTournamentByID;

export const getTournament = (
  slug: string,
  req?: Resources.Util.RequestOf<typeof getTournamentByID>
) => {
  // return getAllTournamentsResource.request(req, (params) => http.get('api/tournaments/all', { params }))
  return promiseToAsyncResult(http.get(`api/tournaments/${slug}`))
}

const {resource: createParticipant} = Resources.Collections.ChallongeTournaments.CreateChallongeTournamentParticipant

export const createParticipantForTournament = (
  req : Resources.Util.RequestOf<typeof createParticipant>
) => {
  return promiseToAsyncResult(http.post(`api/tournaments/register`, {params: req}))
}

const {resource: createTournamentResource} = Resources.Collections.ChallongeTournaments.CreateChallongeTournament;

export const createTournament = (
  req: Omit<Resources.Util.RequestOf<typeof createTournamentResource>, 'start_at'>
) => {
  return promiseToAsyncResult(http.post(`api/tournaments/create`, {params: req}))
}

const {resource: checkUser } = Resources.Collections.ChallongeTournaments.CheckIfUserIsParticipant;

export const checkIfUserIsParticipant = (
  req: Resources.Util.RequestOf<typeof checkUser>
) => {
  console.log('check user with req ==>', req)
  return checkUser.request( req, (data) => http.post('api/tournaments/checkuser', data))
}