const {response, request} = require("express");
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const {createFileReadStream} = require("../../core/utils/file_streams/file_read_stream");
const {responseHandlers} = require("../../core/utils/response_handlers");
const authenticationService = require('../../core/service/authentication-service');
const checkAuthentication = require('../middlewares/checkAuthentication');
const apiConfig = require('../../config/apiConfig.json');

/**
 * Fetch the Login Form
 */
router.get('/login-form', (request, response) => {
    const filePath = __dirname + '/../../pages/login-form.html';

    const readStream = createFileReadStream(filePath)
        .on('error', (err) => {
            console.log(err);
            responseHandlers.internalServer(response, err);
        });

    response.setHeader('Content-Type', 'text/html');
    readStream.pipe(response);
});

router.get('/register-form', (request, response) => {
    const filePath = __dirname + '/../../pages/register-form.html';

    const readStream = createFileReadStream(filePath)
        .on('error', (err) => {
            console.log(err);
            responseHandlers.internalServer(response, err);
        });

    response.setHeader('Content-Type', 'text/html');
    readStream.pipe(response);
});

router.post('/login', (request, response) => {
    const {email, password} = request.body;
    authenticationService.getUser(email, password)
        .then((user) => {
            if (user) {
                response.status(200);
                const jwt = createJWT(user);
                const cookie = createCookie('access_token', jwt);

                response.status(200).json({
                    redirectUrl: apiConfig.loginRegisterRedirectionURL,
                    accessTokenCookie: cookie
                });
            } else {
                response.status(404).send('Wrong credentials');
            }
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});

router.post('/register', (request, response) => {
    const {firstName, lastName, email, password} = request.body;

    authenticationService.register(firstName, lastName, email, password)
        .then(() => {
            const user = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };
            const jwt = createJWT(user);
            const cookie = createCookie('access_token', jwt);

            response.status(200).json({
                redirectUrl: apiConfig.loginRegisterRedirectionURL,
                accessTokenCookie: cookie
            });
        })
        .catch((error) => {
            response.status(500).send(error);
        });
});

router.get('/logout', checkAuthentication, (request, response) => {
    response.clearCookie('access_token');
    response.status(200).json('Successful logout!');
});

function createCookie(name, value) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);
    const expires = expirationDate.toUTCString();
    return `${name}=${value}; path=/; expires=${expires}; secure; SameSite=None;`;
}

function createJWT(user) {
    return jwt.sign({
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        }, apiConfig.jwtSecretKey
        , {expiresIn: '1d'});
}

module.exports = router;