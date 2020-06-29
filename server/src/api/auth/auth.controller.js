import CONFIG from '../../config/config';

export default class UserController {
  login = async (req, res) => {
    if (req.user) {
      res.json({
        success: true,
        message: 'user has successfully authenticated',
        user: req.user,
        cookies: req.cookies,
      });
    }
  };

  logout = async (req, res) => {
    req.logout();
    res.redirect(CONFIG.CLIENT_HOST);
  };
}
