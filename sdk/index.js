const {createChatBox} = require('./chat/chat_handlers');
const {createLoginForm} = require('./login_form/login_form_handler');

const sdk = {
  createChatBox,
  createLoginForm,
};


window.sdk = sdk;
module.exports = sdk;
