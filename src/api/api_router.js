const apiRouter = require('express').Router();
const chatRouter = require('./chat/chat_router');
const loginFormRouter = require('./login_form/login_form_router');
const webNexusRouter = require('./sdk/sdk_router');

apiRouter.use('/chat', chatRouter);
apiRouter.use('/login-form', loginFormRouter);
apiRouter.use('/web-nexus', webNexusRouter);

module.exports = apiRouter;