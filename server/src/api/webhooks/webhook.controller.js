import axios from 'axios';
import crypto from 'crypto';
import CONFIG from '../../config/config';
import { internalServerError, notFound } from '../../helpers/errorHandler';
import { io } from '../../app';
import logger from '../../config/logger';

export default class WebhookController {
  subscribe = async (req, res) => {
    try {
      const { streamer, action, type } = req.query;
      const { accessToken } = req.user;
      if (type === 'all') {
        let promises = [];
        [
          eventsUrls('follows', streamer),
          eventsUrls('follower', streamer),
          eventsUrls('streams', streamer),
        ].forEach(url => {
          promises.push(
            axios.post(
              `${CONFIG.TWITCH_API_URL}/webhooks/hub`,
              {
                'hub.mode':
                  action === 'subscribe' || action === 'unsubscribe'
                    ? action
                    : 'subscribe',
                'hub.topic': url,
                'hub.callback':
                  CONFIG.NODE_ENV === 'production'
                    ? `${CONFIG.HOST}/webhooks?streamer=${streamer}`
                    : `${CONFIG.NGROK_URL}/webhooks?streamer=${streamer}`,
                'hub.lease_seconds': 864000,
                'hub.secret': 'secret!!',
              },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Client-ID': `${CONFIG.TWITCH_CLIENT_ID}`,
                },
              },
            ),
          );
          logger.info(`Submitting request to subscribe to following events...`);
        });
        const response = await Promise.all(promises);
        return res.status(response.status).send({
          success: true,
        });
      }
    } catch (err) {
      return internalServerError(err, req, res);
    }
  };

  verify = async (req, res) => {
    try {
      const { query } = req;
      if (query['hub.challenge']) {
        logger.info(`Subscribed to event!`);
        return res.status(200).send(query['hub.challenge']);
      }
      return notFound(req, res, 'Could not generate token');
    } catch (err) {
      return internalServerError(err, req, res);
    }
  };

  callback = async (req, res) => {
    try {
      const { streamer } = req.query;
      const signature = req.headers['x-hub-signature'].split('=')[1];
      let body = '';
      req.on('data', function(data) {
        body += data;
        if (body.length > 50000000) req.connection.destroy(); // 50 * Math.pow(10, 6) - 50MB Max
      });

      req.on('end', () => {
        if (
          crypto
            .createHmac('sha256', 'secret!!')
            .update(body)
            .digest('hex') !== signature
        ) {
          return res.status(202);
        }
        const event = JSON.parse(body);
        if (event?.data?.[0]) {
          logger.info(`Event received: ${JSON.stringify(event?.data?.[0])}`);
          io.emit(streamer, event?.data?.[0]);
        }
        return res.status(204);
      });
    } catch (err) {
      return internalServerError(err, req, res);
    }
  };
}

const eventsUrls = (type, streamer) => {
  let url;
  switch (type) {
    case 'follows':
      url = `${CONFIG.TWITCH_API_URL}/users/follows?first=1&from_id=${streamer}`;
      break;
    case 'follower':
      url = `${CONFIG.TWITCH_API_URL}/users/follows?first=1&to_id=${streamer}`;
      break;
    case 'streams':
      url = `${CONFIG.TWITCH_API_URL}/streams?user_id=${streamer}`;
      break;
  }
  return url;
};
