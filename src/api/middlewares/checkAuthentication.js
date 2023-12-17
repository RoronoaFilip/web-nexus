const jwt = require('jsonwebtoken');
const apiConfig = require('../../config/apiConfig.json');

const checkAuthentication = (request, response, next) => {
  const token = request.cookies.access_token;

  if (!token) {
    return response.status(401).json('No token found!');
  }

  jwt.verify(token, apiConfig.jwtSecretKey, (error, payload) => {
    if (error) {
      return response.status(403).json('Invalid token!');
    }

    next();
  });
};

module.exports = checkAuthentication;