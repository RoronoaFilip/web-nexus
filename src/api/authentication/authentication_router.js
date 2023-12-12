const {response, request} = require("express");
const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const {createFileReadStream} = require("../../core/utils/file_streams/file_read_stream");
const {responseHandlers} = require("../../core/utils/response_handlers");
const authenticationService = require('../../core/service/authentication-service')
const checkAuthentication = require('../middlewares/checkAuthentication');
const apiConfig = require('../../config/apiConfig.json');

/**
 * Fetch the Login Form
 */
router.get('/get-login-form', (request, response) => {
    const filePath = __dirname + '/../../pages/login-form.html';

    const readStream = createFileReadStream(filePath)
        .on('error', (err) => {
            console.log(err);
            responseHandlers.internalServer(response, err);
        });

    response.setHeader('Content-Type', 'text/html');
    readStream.pipe(response);
});

router.get('/get-register-form', (request, response) => {
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
                response.cookie('access_token', jwt, {
                    httpOnly: true
                }).status(200).json({
                    redirectUrl: apiConfig.loginRegisterRedirectionURL
                })


            } else {
                response.status(404).send('Wrong credentials');
            }

            response.end();
        })
        .catch((error) => {
            console.log(error);
        });
})

router.post('/register', (request, response) => {
    const {firstName, lastName, email, password} = request.body;

    authenticationService.register(firstName, lastName, email, password)
        .then(() => {
            const user = {
                email: email,
                firstName: firstName,
                lastName: lastName
            }

            response.status(200);
            const jwt = createJWT(user);
            response.cookie('access_token', jwt, {
                httpOnly: true
            }).status(200).json({
                redirectUrl: apiConfig.loginRegisterRedirectionURL
            })
            response.end()
        })
        .catch((error) => {
            response.status(500).send(error);
        });
})

router.get('/logout', checkAuthentication, (request, response) => {
    response.clearCookie('access_token');
    response.status(200).json('Successful logout!');
})

function createJWT(user) {
    return jwt.sign({
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
        }, apiConfig.jwtSecretKey
        , {expiresIn: '1d'});
}

module.exports = router;