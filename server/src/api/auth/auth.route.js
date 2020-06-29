import { Router } from 'express';
import passport from 'passport';
import Controller from './auth.controller';
import CONFIG from '../../config/config';

const auth = Router();
const controller = new Controller();

auth.get('/login', controller.login);
auth.get('/logout', controller.logout);
auth.get('/twitch', passport.authenticate('twitch'));
auth.get(
  '/twitch/callback',
  passport.authenticate('twitch', {
    successRedirect: CONFIG.CLIENT_HOST,
    failureRedirect: '/auth/login/failed',
  }),
);

export default auth;
