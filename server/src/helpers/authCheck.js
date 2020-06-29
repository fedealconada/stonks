export const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: 'User has not been authenticated'
    });
  } else {
    next();
  }
};
