function renderAppChats(chatsDivId, currentUserEmail) {
  const chatsApp = document.createElement('app-chats');
  chatsApp.chatsDiv = document.getElementById(chatsDivId) || chatsApp;
  chatsApp.setCurrentUser(currentUserEmail);

  const chatsInputBox = document.getElementsByTagName('chats-input-box')[0];
  chatsInputBox.appendChild(chatsApp);
  chatsApp.render();
}

module.exports = { renderAppChats };