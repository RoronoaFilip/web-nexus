const apiRouter = require('express').Router();
const chatRouter = require('./chat/chat-router');
const loginFormRouter = require('./login_form/login_form_router');
const sdkRouter = require('./sdk/sdk_router');

apiRouter.use('/chat', chatRouter);
apiRouter.use('/login-form', loginFormRouter);
apiRouter.use('/sdk', sdkRouter);

module.exports = apiRouter;