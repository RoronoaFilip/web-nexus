const {createChatBox, setChatBoxDivId} = require('./chat/chat_handlers');
const {createLoginForm} = require('./login_form/login_form_handler');

const sdk = {
  setChatBoxDivId,
  createChatBox,
  createLoginForm,
};


window.sdk = sdk;
module.exports = sdk;
