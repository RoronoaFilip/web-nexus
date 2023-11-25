const {createChatBox, setChatBoxDivId} = require('./chat/chat_handlers');
const {createLoginForm} = require('./login_form/login_form_handler');
const {configureInfiniteScroll} = require('./infinite_scroll/infinite_scroll');

const sdk = {
  setChatBoxDivId,
  createChatBox,
  createLoginForm,
  configureInfiniteScroll,
};


window.sdk = sdk;
