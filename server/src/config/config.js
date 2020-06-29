import dotenv from 'dotenv';

dotenv.config();

const host = process.env.HOST || 'http://localhost:3001';

export default {
  APP: process.env.APP || 'development',
  PORT: process.env.PORT || '3001',
  HOST: host,
  NGROK_URL: 'https://ca2cf33edbcb.ngrok.io',
  CLIENT_HOST: process.env.CLIENT_HOST || 'http://localhost:3000',
  NODE_ENV: process.env.NODE_ENV,
  COOKIE_KEY: 'somecookiekey',
  TWITCH_CLIENT_ID: 'rx8sd9vl5s5utf90cwlxoj052f03t5',
  TWITCH_SECRET: '5ul6o5462zbi0jdem7vgb2xvz8saxn',
  CALLBACK_URL: `${host}/auth/twitch/callback`, // You can run locally with - http://localhost:3000/auth/twitch/callback
  TWITCH_API_URL: 'https://api.twitch.tv/helix',
};
