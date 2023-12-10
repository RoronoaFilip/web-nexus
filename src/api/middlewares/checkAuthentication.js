const jwt = require('jsonwebtoken');
const config = require('../../config/config.json');

const checkAuthentication = (request, response, next) => {
    const token = request.cookies.access_token;

    if (!token) {
        return response.status(401).json('No token found!');
    }

    jwt.verify(token, config.jwtSecretKey, (error, userId) => {
        if (error) {
            return response.status(403).json('Invalid token!');
        }
        request.user = {
            id: userId
        }

        next();
    })
}

module.exports = checkAuthentication