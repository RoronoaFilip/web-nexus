const { createChatBox, setChatBoxDivId } = require('./chat/chat_handlers');
const { createLoginForm, goToLoginForm } = require('./login_form/login_form_handler');
const { configureInfiniteScroll } = require('./infinite_scroll/infinite_scroll');

const webNexus = {
  setChatBoxDivId,
  createChatBox,
  createLoginForm,
  goToLoginForm,
  configureInfiniteScroll,
};


window.webNexus = webNexus;
