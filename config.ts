import Config from 'react-native-config';

const {REACT_APP_API_KEY} = Config;

export default {
  apiKey: REACT_APP_API_KEY,
  apiUrl: 'https://api-football-v1.p.rapidapi.com/v3/',
};
