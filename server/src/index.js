import { app, initSocket } from './app';
import CONFIG from './config/config';
import logger from './config/logger';

const { PORT } = CONFIG;

const server = app.listen(PORT, err => {
  if (err) {
    return console.log(err);
  }
  logger.info(`Server is listening on ${PORT}`);
});
initSocket(server);
