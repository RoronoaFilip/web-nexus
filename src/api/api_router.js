const apiRouter = require('express').Router();
const chatRouter = require('./chat/chat_router');
const authenticationRouter = require('./authentication/authentication_router');
const webNexusRouter = require('./sdk/sdk_router');

apiRouter.use('/chat', chatRouter);
apiRouter.use('/authentication', authenticationRouter);
apiRouter.use('/web-nexus', webNexusRouter);

module.exports = apiRouter;