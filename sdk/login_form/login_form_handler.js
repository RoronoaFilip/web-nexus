const {addUserOnline} = require('../chat/chat_handlers');

const loginFormUrl = 'http://localhost:8080/api/login-form';

function setUpLoginForm() {
  const loginForm = document.getElementById('sdk-login-form');

  loginForm.addEventListener('submit', function() {
    const username = document.getElementById('sdk-username-input')
        .value.trim();

    const password = document.getElementById('sdk-password-input')
        .value.trim();

    loginForm.parentElement.remove();

    addUserOnline(username, password);
  });
}

function createLoginForm(divId = undefined) {
  fetch(loginFormUrl)
      .then((result) => result.text())
      .then((body) => {
        if (divId) {
          document.getElementById(divId).innerHTML = body;
        } else {
          const loginFormDiv = document.createElement('div');
          loginFormDiv.innerHTML = body;
          document.body.insertBefore(loginFormDiv, document.body.firstChild);
        }

        setUpLoginForm();
      });
}

module.exports = {createLoginForm};
