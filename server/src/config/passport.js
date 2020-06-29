import passport from 'passport';
import dotenv from 'dotenv';
import twitchStrategy from 'passport-twitch-new';
import CONFIG from './config';

dotenv.config();

const Strategy = twitchStrategy.Strategy;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new Strategy(
    {
      clientID: CONFIG.TWITCH_CLIENT_ID,
      clientSecret: CONFIG.TWITCH_SECRET,
      callbackURL: CONFIG.CALLBACK_URL,
      scope: 'bits:read',
      customHeaders: {
        'client-id': CONFIG.TWITCH_CLIENT_ID,
      },
      responseType: 'token',
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      done(null, profile);
    },
  ),
);
