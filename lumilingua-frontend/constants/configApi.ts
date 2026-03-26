import Constants from 'expo-constants';

const API_CONFIG = {
  CRMS_BASE_URL: 'https://pct-ipaq-adaptive-mental.trycloudflare.com/api',
  CLIENT_BASE_URL: 'https://corpus-significance-laugh-though.trycloudflare.com/api',
  CRMS_IMG_URL: 'https://pct-ipaq-adaptive-mental.trycloudflare.com',
};

export const {
  CRMS_BASE_URL,
  CLIENT_BASE_URL,
  CRMS_IMG_URL,
} = API_CONFIG;

export const getCrmsEndpoint = (path: string) => `${CRMS_BASE_URL}/${path}`;
export const getCrmsImgEndpoint = (path: string) => `${CRMS_IMG_URL}/${path}`;
export const getClientEndpoint = (path: string) => `${CLIENT_BASE_URL}/${path}`;