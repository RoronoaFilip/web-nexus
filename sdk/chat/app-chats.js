const {html, render} = require('lit-html');
const io = require("socket.io-client");
const {createRef, ref} = require("lit-html/directives/ref.js");
const {when} = require("lit-html/directives/when.js");

class AppChats extends HTMLElement {
  socketUrl = 'http://localhost:8081';
  openChatUsernames = [];
  #socket
  #showRoot
  #inputRef = createRef();
  chatsDiv;
  currentUser = '';

  constructor() {
    super();

    this.#showRoot = this.attachShadow({mode: 'open'});
    this.#socket = io(this.socketUrl);
    this.#socket.on("receive private message", (messageObject) => {
      const {from, to, message} = messageObject
      const chatBox = document.getElementById(`chatBox${from}`);
      chatBox?.receiveMessage(message);
    });
  }

  getTemplate() {
    return html`
        <input ${ref(this.#inputRef)} type="text" placeholder="enter username"/>
        <button @click=${this.renderChat.bind(this)}>Start Chat</button>
        <div>Chats</div>
        <div id="chats"></div>
    `
  }

  setCurrentUser(email) {
    this.currentUser = email;
    this.#socket.emit('store user', email);
  }

  renderChat() {
    const recipient = this.#inputRef.value.value;
    this.#inputRef.value.value = '';
    this.openChatUsernames.push(recipient);

    const chat = document.createElement('app-chat');

    chat.setMe(this.currentUser);
    chat.setRecipient(recipient);
    chat.onSend((messageObject) => {
      this.#socket.emit("send private message", messageObject);
    });

    this.chatsDiv.appendChild(chat);
    chat.render();
  }

  render() {
    render(this.getTemplate(this), this.#showRoot);
  }

}

customElements.define("app-chats", AppChats);