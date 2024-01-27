const { createChatBox, setChatBoxDivId } = require('./chat/chat_handlers');
const { goToLoginForm, initializeAuthenticationContainer } = require('./login_form/authentication_handler');
const  setupInfiniteScroll  = require('./infinite_scroll/infinite_scroll').setupFunction;
const  setupInfiniteScrollV2  = require('./infinite_scroll/infinite_scroll_v2').setupFunction;

const webNexus = {
  setChatBoxDivId,
  createChatBox,
  goToLoginForm,
  initializeAuthenticationContainer,
  setupInfiniteScroll,
  setupInfiniteScrollV2,
};


window.webNexus = webNexus;
