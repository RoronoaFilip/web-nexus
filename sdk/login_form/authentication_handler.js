const { addUserOnline } = require('../chat/v1/chat_handlers');
const { renderAppChats } = require('../chat/v2/chat_handlers_v2');
const bcrypt = require('bcryptjs');

const loginFormUrl = 'http://localhost:8080/api/authentication/login-form';
const registerFormUrl = 'http://localhost:8080/api/authentication/register-form';
const backendLoginEndpoint = 'http://localhost:8080/api/authentication/login';
const backendRegisterEndpoint = 'http://localhost:8080/api/authentication/register';

const authEventHandler = {
  onSuccessfulAuthenticationHandler: defaultOnSuccessfulAuthenticationHandler,
  onErrorHandler: (error) => {
    alert('Wrong email or password!');
  },
  onServerErrorHandler: () => {
    const url = 'http://localhost:63342/web-nexus/sdk/pages/internal-server-error.html';
    window.location.replace(url);
  }
};

const forms = {
  loginForm: null,
  registerForm: null
};

function initializeAuthenticationContainer(divId, version, chatBoxDivId,
  onSuccessfulCb = undefined,
  onErrorCb = undefined,
  onServerError = undefined) {
  setUpLoginForm(divId, version, chatBoxDivId);
  setResponseEvents(onSuccessfulCb, onErrorCb, onServerError);
}

function setUpLoginForm(divId, version, chatBoxDivId) {
  fetch(loginFormUrl)
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      return Promise.reject(response);
    })
    .then((body) => {
      if (divId) {
        document.getElementById(divId).innerHTML = body;
      } else {
        const authContainerDiv = document.createElement('div');
        authContainerDiv.innerHTML = body;
        document.body.insertBefore(authContainerDiv, document.body.firstChild);
      }

      forms.loginForm = body;
    })
    .then(() => setUpLoginEvent(version, chatBoxDivId))
    .then(() => setUpRegisterForm(divId))
    .catch((error) => {
      console.log('wrong');
      authEventHandler.onErrorHandler(error);
    });
}

function setUpLoginEvent(version, chatBoxDivId) {
  const onSuccessfulAuthenticationCb = version === 'v2' ? renderAppChats : addUserOnline;
  const loginForm = document.getElementById('web-nexus-auth-form');
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('web-nexus-email-input')
      .value.trim();
    const password = document.getElementById('web-nexus-password-input')
      .value.trim();
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    login(email, password)
      .then((data) => {
        authEventHandler.onSuccessfulAuthenticationHandler(data);
        onSuccessfulAuthenticationCb(chatBoxDivId, email);
        loginForm.parentElement.remove();
      })
      .catch((error) => {
        authEventHandler.onErrorHandler();
      });
  });
}

function setUpRegisterForm(divId) {
  let switchToRegisterButton = document.getElementById("switch-to-register");
  switchToRegisterButton?.addEventListener("click", function (event) {
    event.preventDefault();
    fetch(registerFormUrl)
      .then(response => {
        if (response.ok) {
          return response.text();
        }
        return Promise.reject(response);
      })
      .then((body) => {
        const authContainerDiv = document.getElementById(divId);
        authContainerDiv.innerHTML = body;
        forms.registerForm = body;
      })
      .then(setUpRegisterEvent)
      .then(() => setUpSwitchToLoginEvent(divId))
      .catch((error) => {
        console.log(error);
      });
  });
}

function setUpRegisterEvent() {
  const registerForm = document.getElementById('web-nexus-register-form');
  registerForm?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const firstName = document.getElementById('web-nexus-firstname-input')
      .value.trim();
    const lastName = document.getElementById('web-nexus-lastname-input')
      .value.trim();
    const email = document.getElementById('web-nexus-email-input')
      .value.trim();
    const password = document.getElementById('web-nexus-register-password-input')
      .value.trim();
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    register(firstName, lastName, email, password)
      .then((data) => {
        authEventHandler.onSuccessfulAuthenticationHandler(data);
        addUserOnline(email);
        registerForm.parentElement.remove();
      })
      .catch(() => {
        authEventHandler.onServerErrorHandler();
      });
  });
}

function setUpSwitchToLoginEvent(divId) {
  let switchToLoginButton = document.getElementById("switch-to-login");
  switchToLoginButton?.addEventListener("click", function (event) {
    event.preventDefault();
    const authContainerDiv = document.getElementById(divId);
    authContainerDiv.innerHTML = forms.loginForm;
  });
}

function setResponseEvents(onSuccessfulAuthenticationCb, onErrorCb, onServerError) {
  authEventHandler.onSuccessfulAuthenticationHandler = onSuccessfulAuthenticationCb || authEventHandler.onSuccessfulAuthenticationHandler;
  authEventHandler.onErrorHandler = onErrorCb || authEventHandler.onErrorHandler;
  authEventHandler.onServerErrorHandler = onServerError || authEventHandler.onServerErrorHandler;
}

function goToLoginForm(redirectUrl) {
  window.location.href = '../../src/pages/login-form.html';
  setUpLoginForm();
}

function register(firstName, lastName, email, password) {
  const requestBody = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  };

  return new Promise((resolve, reject) => {
    fetch(backendRegisterEndpoint, requestOptions)
      .then((response) => {
        if (response.status === 404) {
          reject(authEventHandler.onErrorHandler);
        }
        if (response.status === 500) {
          reject(authEventHandler.onServerErrorHandler);
        }
        if (!response.ok) {
          reject(() => {
            console.log(`Server returned ${response.status}`);
          });
        }

        return response.json();
      }).then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject((error) => {
          console.log(error);
          // authEventHandler.onErrorHandler();
        });
      });
  });
}

function login(email, password) {
  const requestBody = {
    email: email,
    password: password,
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  };

  return new Promise((resolve, reject) => {
    fetch(backendLoginEndpoint, requestOptions)
      .then((response) => {
        if (response.status === 404) {
          reject(authEventHandler.onErrorHandler);
        }
        if (response.status === 500) {
          reject(authEventHandler.onServerErrorHandler);
        }
        if (!response.ok) {
          reject(() => {
            console.log(`Server returned ${response.status}`);
          });
        }

        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject((error) => {
          console.log(error);
          // authEventHandler.onErrorHandler();
        });
      });
  });
}

function defaultOnSuccessfulAuthenticationHandler(data) {
  document.cookie = data.accessTokenCookie;
  window.location.replace(data.redirectUrl);
}

module.exports = { goToLoginForm, initializeAuthenticationContainer };
