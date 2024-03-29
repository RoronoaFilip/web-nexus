const { html, render } = require('lit-html');
const { createRef, ref } = require("lit-html/directives/ref.js");
const { when } = require("lit-html/directives/when.js");
const commons = require('../commons');
const styles = require('./app-chat.css');

class AppChat extends HTMLElement {
  messages = []; // {"type": "received/sent", "message": "string"}
  #showRoot;
  #inputRef = createRef();
  onSendCb = () => undefined;
  onCloseCb= () => undefined;
  me = '';
  them = '';

  constructor() {
    super();
    this.#showRoot = this.attachShadow({ mode: 'closed' });
    this.closeChat = this.closeChat.bind(this);
    this.renderMessages = this.renderMessages.bind(this);
    this.setupChatFromDb = this.setupChatFromDb.bind(this);
  }

  getTemplate() {
    const renderMessages = () => html`${this.messages.map(message => html`
        <div class="message ${message.type}-message">${message.message}</div>`)}`;
    return html`
        <style>${styles.default.toString()}</style>
        <div class="chat-box">
            <div class="chat-header">Chat with ${this.them}
                <button class="close-button" @click="${this.closeChat}">
                    X
                </button>
            </div>
            <div class="chat-messages" id="chatMessages${this.them}">
                ${when(this.messages.length > 0, renderMessages)}
            </div>
            <form class="chat-input-send-button-wrapper" id="formSubmit${this.them}">
                <input ${ref(this.#inputRef)} type="text" class="message-input" placeholder="Type your message...">
                <button class="send-button" @click="${this.sendMessage.bind(this)}">Send</button>
            </form>
        </div>
    `;
  }

  sendMessage(event) {
    event?.preventDefault();
    const message = this.#inputRef.value.value;
    this.#inputRef.value.value = '';
    this.#inputRef.value.focus();
    this.messages.push({ type: 'sent', message });
    this.onSendCb({ from: this.me, to: this.them, message });
    this.render();
    console.log('Sender: ', this.me);
    console.log('Receiver: ', this.them);
  }

  addReceivedMessage(message) {
    console.log('received message: ', message);
    this.messages.push({ type: 'received', message });
    this.render();
  }

  addSendMessage(message) {
    console.log('send message: ', message);
    this.messages.push({ type: 'sent', message });
    this.render();
  }

  setRecipient(recipient) {
    this.them = recipient;
    this.id = `chatBox${recipient}`;
  }

  setMe(me) {
    this.me = me;
  }

  onSend(cb) {
    this.onSendCb = cb;
  }

  onClose(cb) {
    this.onCloseCb = cb;
  }

  closeChat() {
    document.getElementById(`chatBox${this.them}`)?.remove();
    commons.constructChatRequestOptions(this.me, this.them);
    this.onCloseCb({ from: this.me, to: this.them });
  }

  async setupChatFromDb(messages) {
    await this.renderMessages(messages);
    this.render();
  }

  renderMessages(messages) {
    console.log(messages);
    messages.forEach(currentMessage => {
      if (currentMessage.from === this.me) {
        this.addSendMessage(currentMessage.message);
      } else {
        this.addReceivedMessage(currentMessage.message);
      }
    });
  }

  render() {
    render(this.getTemplate(this), this.#showRoot);
  }

}

customElements.define("app-chat", AppChat);