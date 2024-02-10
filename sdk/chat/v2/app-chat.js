const { html, render } = require('lit-html');
const { createRef, ref } = require("lit-html/directives/ref.js");
const { when } = require("lit-html/directives/when.js");
const styles = require('./app-chat.css');

class AppChat extends HTMLElement {
  messages = []; // {"type": "received/sent", "message": "string"}
  #showRoot;
  #inputRef = createRef();
  onSendCb = () => undefined;
  me = '';
  them = '';

  constructor() {
    super();
    this.#showRoot = this.attachShadow({ mode: 'closed' });
  }

  getTemplate() {
    const renderMessages = () => html`${this.messages.map(message => html`
        <div class="message ${message.type}-message">${message.message}</div>`)}`;
    return html`
        <style>${styles.default.toString()}</style>
        <div class="chat-box">
            <div class="chat-header">Chat with ${this.them}
                <button class="close-button" @click="${() => document.getElementById(`chatBox${this.them}`)?.remove()}">
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
  }

  receiveMessage(message) {
    this.messages.push({ type: 'received', message });
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

  render() {
    render(this.getTemplate(this), this.#showRoot);
  }

}

customElements.define("app-chat", AppChat);