import ax from 'axios';
import config from '../../../config';

const authNetworkService = ax.create({
  timeout: 25000,
  baseURL: config.apiUrl,
  headers: {
    'X-RapidAPI-Key': `${config.apiKey}`,
    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
    // Accept: 'application/json',
    // 'content-type': 'application/json',
    // 'Access-Control-Allow-Origin': '*',
  },
  responseType: 'json',
});

// if (__DEV__) {
//   authNetworkService.interceptors.request.use(
//     requestConfig => {
//       const {method, url, data, headers} = requestConfig;
//       console.log(`🤔 ${method.toUpperCase()} ${url}`, {data, headers}); // eslint-disable-line no-console
//       return requestConfig;
//     },
//     error => {
//       console.log('❌', error); // eslint-disable-line no-console
//       return Promise.reject(error);
//     },
//   );
//   authNetworkService.interceptors.response.use(
//     response => {
//       const {
//         data,
//         headers,
//         config: {url, method},
//       } = response;
//       console.log(`✅ ${method.toUpperCase()} "${url}"`, {data, headers}); // eslint-disable-line no-console
//       return response;
//     },
//     error => {
//       console.log('❌', error); // eslint-disable-line no-console
//       return Promise.reject(error);
//     },
//   );
// }

export default authNetworkService;
