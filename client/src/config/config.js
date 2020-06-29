import dotenv from 'dotenv';

dotenv.config();
export default {
  API_HOST: process.env.NODE_ENV === 'production' ? 'https://stonks-server.herokuapp.com' : 'http://localhost:3001'
};
