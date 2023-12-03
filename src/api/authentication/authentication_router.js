const {createFileReadStream} = require("../../core/utils/file_streams/file_read_stream");
const {responseHandlers} = require("../../core/utils/response_handlers");
const {response} = require("express");
const router = require('express').Router();
const authenticationService = require('../../core/service/authentication-service')
const bcrypt = require("bcryptjs");

/**
 * Fetch the Login Form
 */
router.get('/', (request, response) => {
    const filePath = __dirname + '/../../pages/login_form.html';

    const readStream = createFileReadStream(filePath)
        .on('error', (err) => {
            console.log(err);
            responseHandlers.internalServer(response, err);
        });

    response.setHeader('Content-Type', 'text/html');
    readStream.pipe(response);
});

router.post('/login', async (request, response) => {
    const {email, password} = request.body;
    authenticationService.getUser(email, password)
        .then((user) => {
            if (user) {
                response.status(200).json({
                    redirectUrl: 'http:localhost:8080/web-nexus/demo/main3.html'
                })
                response.end();
            } else {
                response.status(404)
                response.end();
            }
        })
        .catch((error) => {
            console.log(error);
        });
})

module.exports = router;