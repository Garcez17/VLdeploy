const { verify } = require('jsonwebtoken');

const authConfig = require('../config/auth');

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    verify(token, authConfig.jwt.secret);
    
    return next();
  } catch {
    throw new Error('Invalid JWT token');
  }
}

module.exports = ensureAuthenticated;