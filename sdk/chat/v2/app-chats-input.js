const { html, render } = require('lit-html');
const io = require("socket.io-client");
const { createRef, ref } = require("lit-html/directives/ref.js");

import './app-chat';

class AppChatsInput extends HTMLElement {
  socketUrl = 'http://localhost:8081';
  openChatUsernames = [];
  #socket;
  #showRoot;
  #inputRef = createRef();
  chatsDiv;
  currentUser = '';

  constructor() {
    super();

    this.#showRoot = this.attachShadow({ mode: 'closed' });

    this.#socket = io(this.socketUrl);
    this.#socket.on("receive private message", (messageObject) => {
      const { from, to, message } = messageObject;
      let chatBox = document.getElementById(`chatBox${from}`);
      if (!chatBox) {
        chatBox = this.renderChat(from);
      }
      chatBox.receiveMessage(message);
    });
    this.#socket.on("private message error", (error) => {
      alert(error);
    });
  }

  getTemplate() {
    return html`
        <form @submit=${this.onSubmit.bind(this)}>
            <input ${ref(this.#inputRef)} type="text" placeholder="enter email"/>
            <button>Start Chat</button>
        </form>
        <div id="chats"></div>
    `;
  }

  setCurrentUser(email) {
    this.currentUser = email;
    this.#socket.emit('store user', email);
  }

  onSubmit(event) {
    event.preventDefault();
    this.renderChat();
  }

  renderChat(newChatRecipient = null) {
    const recipient = this.#inputRef.value.value || newChatRecipient;
    this.#inputRef.value.value = '';
    this.openChatUsernames.push(recipient);

    const chat = document.createElement('app-chat');
    chat.setMe(this.currentUser);
    chat.setRecipient(recipient);
    chat.onSend((messageObject) => {
      if (messageObject.to !== messageObject.from) {
        this.#socket.emit("send private message", messageObject);
      }
    });

    this.chatsDiv.appendChild(chat);
    chat.render();

    return chat;
  }

  render() {
    render(this.getTemplate(this), this.#showRoot);
  }

}

customElements.define("app-chats-input", AppChatsInput);