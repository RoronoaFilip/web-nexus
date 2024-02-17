import './app-chat';

const {html, render} = require('lit-html');
const io = require("socket.io-client");
const {createRef, ref} = require("lit-html/directives/ref.js");
const commons = require('../commons');

class AppChatsInput extends HTMLElement {
  socketUrl = 'http://localhost:8081';
  getMessagesUrl = 'http://localhost:8081/api/chat/get-messages';
  openChatUsernames = [];
  #socket;
  #showRoot;
  #inputRef = createRef();
  chatsDiv;
  currentUser = '';

  constructor() {
    super();

    this.#showRoot = this.attachShadow({mode: 'closed'});

    this.#socket = io(this.socketUrl);
    this.#socket.on("receive private message", (messageObject) => {

      const {from, to, message} = messageObject;
      let chatBox = document.getElementById(`chatBox${from}`);
      if (!chatBox) {
        chatBox = this.renderChat(from);
        this.loadMessages(chatBox, this.currentUser, from, message);
      } else {
        chatBox.addReceivedMessage(message);
      }
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
    const requestObject = {
      from: this.currentUser,
      to: recipient
    };
    this.#socket.emit('load chat', requestObject);
    const chat = this.renderChat(recipient);
    this.loadMessages(chat, this.currentUser, recipient);
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

  loadMessages(chat, from, to, message = null) {
    const body = commons.constructChatRequestOptions(from, to);
    fetch(this.getMessagesUrl, body)
        .then(response => {

          if (response.status !== 200) {
            return Promise.reject("no chat found");
          }

          return response.json(); // or response.text() based on the response type
        })
        .then(messages => {
          if (message) {
            messages.messages.push({from: to, message});
          }

          chat.setupChatFromDb(messages.messages);
        })
        .catch(error => {
          alert(error);
        });
  }

  render() {
    render(this.getTemplate(this), this.#showRoot);
  }

}


customElements.define("app-chats-input", AppChatsInput);