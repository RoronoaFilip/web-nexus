const io = require('socket.io-client');

const config = {
  socket: undefined,
  currentUser: undefined,
  chatsContainerDivId: undefined,
};

const socketUrl = 'http://localhost:8081';
const chatUrl = 'http://localhost:8080/api/chat';
const cssUrl = 'http://localhost:8080/api/chat/css';

/**
 * Append a message to the chat box of a recipient.
 * The chat box is determined by the name of the recipient.
 * The chat box is created if it does not exist.
 * @param messageDiv
 * @param recipient
 */
function appendMessage(messageDiv, recipient) {
  let chatMessages = document.getElementById('chatMessages' + recipient);

  function append() {
    chatMessages = chatMessages || document.getElementById('chatMessages' + recipient);
    chatMessages && chatMessages.appendChild(messageDiv);

    const firstMessage = chatMessages.lastChild;
    // Scroll the first message into view
    if (firstMessage) {
      chatMessages.scrollTop = firstMessage.offsetTop;
    }
  }

  if (!chatMessages) {
    fetchChatBox(recipient).then(append);
  } else {
    setTimeout(append, 0);
  }
}

/**
 * Set up socket listeners for chat box form for sending messages and closing the chat box
 * @param recipient
 */
function setUpSocketCommunication(recipient) {
  // Send a private message
  document.getElementById('formSubmit' + recipient).addEventListener('submit', function (e) {
    const messageInput = document.getElementById('messageInput' + recipient);
    const message = messageInput.value.trim();
    e.preventDefault();
    const to = recipient;
    if (to && message) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message sent-message';
      messageDiv.textContent = message;
      appendMessage(messageDiv, recipient);

      messageInput.value = '';
      messageInput.focus();

      if (config.currentUser === recipient) {
        return; // We have messaged ourselves
      }

      config.socket.emit('send private message', { from: config.currentUser, to, message });
    }
  });

  document.getElementById('close-button' + recipient).addEventListener('click', function (e) {
    e.preventDefault();
    const chatBox = document.getElementById('chatBox' + recipient).parentElement;
    chatBox.remove();
  });
}

/**
 * Set up socket listeners for receiving messages
 * @param socket - The socket to listen on
 */
function setUpReceive(socket) {
  // Receive private messages
  socket.on('receive private message', function (data) {
    const { from, message } = data;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message received-message';
    messageDiv.textContent = message;
    appendMessage(messageDiv, from);
  });

  // Handle errors for private messages
  socket.on('private message error', function (error) {
    alert(error);
  });
}

function fetchChatBox(recipient) {
  return fetch(chatUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      name: recipient,
    }),
  })
    .then((result) => result.text())
    .then((body) => {
      const chatBoxDiv = document.createElement('div');
      chatBoxDiv.innerHTML = body;
      document.getElementById(config.chatsContainerDivId).appendChild(chatBoxDiv);
      setUpSocketCommunication(recipient);
      return body;
    });
}

function attachStyling() {
  fetch(cssUrl)
    .then((result) => result.text())
    .then((result) => {
      const css = document.createElement('style');
      css.textContent = result;
      document.head.appendChild(css);
    });
}

function addUserOnline(chatBoxDivId, email) {
  setChatBoxDivId(chatBoxDivId);
  config.socket = io(socketUrl);

  config.currentUser = email;

  // fetch post request for login and auth
  config.socket.emit('store user', email);

  setUpReceive(config.socket);

  attachStyling();
}

function createChatBox(recipient) {
  fetchChatBox(recipient).then();
}

function setChatBoxDivId(divId) {
  config.chatsContainerDivId = divId;
}

module.exports = { createChatBox, addUserOnline };
