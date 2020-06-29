import axios from 'axios';
import CONFIG from './config';

const subscribeEvent = async (streamerId) => {
  return axios.put(`${CONFIG.API_HOST}/webhooks?streamer=${streamerId}&action=subscribe&type=all`, {}, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    }
  });
}

const login = async () => {
  return axios(`${CONFIG.API_HOST}/auth/login`, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    }
  });
}

const getStreamer = async (username) => {
  return axios(`${CONFIG.API_HOST}/users?username=${username}`, {
    withCredentials: true,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    }
  });
}

export {
  subscribeEvent,
  login,
  getStreamer
}
