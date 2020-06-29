import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { authCheck } from './helpers/authCheck';
import routes from './api/index';
import CONFIG from './config/config';
import * as errorHandler from './helpers/errorHandler';
import './config/passport';
import socket from 'socket.io';
import logger from './config/logger';

const app = express();
let io;

const initSocket = server => {
  io = socket(server);
  io.on('connection', socket => {
    logger.info('Socket connected');
    socket.on('disconnect', () => {
      logger.info('Client disconnected');
    });
  });
};

// middlewares
app.use(
  cookieSession({
    name: 'session',
    keys: [CONFIG.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  }),
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: CONFIG.CLIENT_HOST, // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // allow session cookie from browser to pass through
  }),
);
app.use(morgan('dev'));
app.use(helmet());

// routes
app.use('/', routes);

// if it's already login, send the profile response, otherwise, send a 401 response that the user is not authenticated authCheck before navigating to home page
app.get('/', authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: 'user successfully authenticated',
    user: req.user,
    cookies: req.cookies,
  });
});

// error handlers
app.use(errorHandler.notFound);
app.use(errorHandler.internalServerError);

export { app, initSocket, io };
