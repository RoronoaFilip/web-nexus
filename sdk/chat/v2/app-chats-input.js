import './app-chat';

const { html, render } = require('lit-html');
const io = require("socket.io-client");
const commons = require('../commons');
const { createRef, ref } = require("lit-html/directives/ref.js");


class AppChatsInput extends HTMLElement {
  socketUrl = 'http://localhost:8081';
  setUpChatUrl = 'http://localhost:8080/api/chat/set-chat-details';
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
      chatBox.addReceivedMessage(message);
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
    const recipient = this.#inputRef.value.value;
    const requestOptions = commons.constructChatRequestOptions(this.currentUser, recipient);

    fetch(this.setUpChatUrl, requestOptions)
      .then(() => {
        this.renderChat(recipient);
      }).catch((response) => {
        alert(response.message);
      });
  }

  renderChat(recipient) {
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
    chat.onClose((messageObject) => {
      const index = this.openChatUsernames.indexOf(messageObject.to);
      if (index > -1) {
        this.openChatUsernames.splice(index, 1);
      }

      this.#socket.emit("save chat", messageObject);
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