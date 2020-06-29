import axios from 'axios';
import CONFIG from '../../config/config';
import { notFound } from '../../helpers/errorHandler';

export default class UserController {
  search = async (req, res) => {
    try {
      const { username } = req.query;
      const { accessToken } = req.user;
      const response = await axios.get(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Client-ID': `${CONFIG.TWITCH_CLIENT_ID}`
          }
        }
      );
      if (response?.data?.data?.length > 0) {
        const streamer = response.data.data[0]; // -> we take the first occurrence for this example
        res.status(200).send({
          success: true,
          data: streamer
        });
      }
      return notFound(req, res, 'Streamer not found');
    } catch (err) {
      return res.status(err?.response?.data?.status || 500).send({
        success: false,
        error: err?.response?.data?.error,
        message: err?.response?.data?.message || err.toString()
      });
    }
  };
}
