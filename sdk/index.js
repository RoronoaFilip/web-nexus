import './chat/v2/app-chats-input';
import { setupFunction as setupInfiniteScroll } from './infinite_scroll/infinite_scroll';
import { setupFunction as setupInfiniteScrollV2 } from './infinite_scroll/infinite_scroll_v2';
import { createChatBox } from './chat/v1/chat_handlers';
import { goToLoginForm, initializeAuthenticationContainer } from './login_form/authentication_handler';

const webNexus = {
  createChatBox,
  goToLoginForm,
  initializeAuthenticationContainer,
  setupInfiniteScroll,
  setupInfiniteScrollV2,
};

window.webNexus = webNexus;
