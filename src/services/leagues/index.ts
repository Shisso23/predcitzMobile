import authNetworkService from '../auth-network-service/auth-network.service';
import {LeaguesFilterModel} from '../../models/leagues';

const endpoint = 'leagues';

const getFilteredLeagues = async (filters: LeaguesFilterModel) => {
  return authNetworkService.get(endpoint, {
    params: filters,
  });
};

export default {
  getFilteredLeagues,
};
