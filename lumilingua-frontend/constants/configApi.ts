import Constants from 'expo-constants';

const API_CONFIG = {
  CRMS_BASE_URL: 'https://exhibitions-bodies-word-oecd.trycloudflare.com/api',
  CLIENT_BASE_URL: 'https://bedford-fort-stated-gardening.trycloudflare.com/api',
  CRMS_IMG_URL: 'https://exhibitions-bodies-word-oecd.trycloudflare.com',
  CRMS_WEBSOCKET: 'https://exhibitions-bodies-word-oecd.trycloudflare.com/ws',
};

export const {
  CRMS_BASE_URL,
  CLIENT_BASE_URL,
  CRMS_IMG_URL,
  CRMS_WEBSOCKET,
} = API_CONFIG;

export const getCrmsEndpoint = (path: string) => `${CRMS_BASE_URL}/${path}`;
export const getCrmsWebSocketEndpoint = () => `${CRMS_WEBSOCKET}`;
export const getCrmsImgEndpoint = (path: string) => `${CRMS_IMG_URL}/${path}`;
export const getClientEndpoint = (path: string) => `${CLIENT_BASE_URL}/${path}`;