const io = require('socket.io-client');
let socket;
let currentUser;
let chatsContainerDivId;

function appendMessage(messageDiv, recipient) {
  let chatMessages = document.getElementById('chatMessages' + recipient);

  function append() {
    chatMessages = chatMessages || document.getElementById('chatMessages' + recipient);
    chatMessages && chatMessages.appendChild(messageDiv);
  }

  if (!chatMessages) {
    fetchChatBox(recipient).then(append);
  } else {
    setTimeout(append, 0);
  }
}

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

      if (currentUser === recipient) {
        return; // We have messaged ourselves
      }

      socket.emit('send private message', {from: currentUser, to, message});
    }
  });

  document.getElementById('close-button' + recipient).addEventListener('click', function (e) {
    e.preventDefault();
    const chatBox = document.getElementById('chatBox' + recipient);
    chatBox.remove();
  });
}

function setUpReceive(socket) {
  // Receive private messages
  socket.on('receive private message', function (data) {
    const {from, message} = data;
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

function addUserOnline(username, password) {
  socket = io('http://localhost:8081');

  currentUser = username;
  console.log(password);

  // fetch post request for login and auth
  socket.emit('store user', username);

  setUpReceive(socket);
}

function fetchChatBox(recipient) {
  return fetch('http://localhost:8080/chat', {
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
        document.getElementById(chatsContainerDivId).appendChild(chatBoxDiv);
        setUpSocketCommunication(recipient);
        return body;
      });
}

function createChatBox(recipient) {
  fetchChatBox(recipient).then();
}

function setChatBoxDivId(divId) {
  chatsContainerDivId = divId;
}

module.exports = {createChatBox, addUserOnline, setChatBoxDivId};
