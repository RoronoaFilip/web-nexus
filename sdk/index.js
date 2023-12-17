const { createChatBox, setChatBoxDivId } = require('./chat/chat_handlers');
const { goToLoginForm, initializeAuthenticationContainer } = require('./login_form/login_form_handler');
const { configureInfiniteScroll } = require('./infinite_scroll/infinite_scroll');
const { configureInfiniteScrollV2 } = require('./infinite_scroll/infinite_scroll_v2');

const webNexus = {
  setChatBoxDivId,
  createChatBox,
  goToLoginForm,
  initializeAuthenticationContainer,
  configureInfiniteScroll,
  configureInfiniteScrollV2,
};


window.webNexus = webNexus;
