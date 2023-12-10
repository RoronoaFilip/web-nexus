const {addUserOnline} = require('../chat/chat_handlers');
const bcrypt = require('bcryptjs');

const loginFormUrl = 'http://localhost:8080/api/authentication';
const wrongCredentialsPage = 'http://localhost:8080/api/wrong-credentials-modal';
const backendLoginEndpoint = 'http://localhost:8080/api/authentication/login'

function setUpLoginForm(redirectUrl) {
    const loginForm = document.getElementById('web-nexus-login-form');

    loginForm.addEventListener('submit', async function () {
        const email = document.getElementById('web-nexus-username-input')
            .value.trim();

        const password = document.getElementById('web-nexus-password-input')
            .value.trim();
        // const salt = bcrypt.genSaltSync(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        loginForm.parentElement.remove();

        login(email, password)
            .then((data) => {
                window.location.replace(data.redirectUrl);
                // addUserOnline(email, hashedPassword);
            })
            .catch((errorHandler) => {
                errorHandler();
            })
    });
}

function createLoginForm(redirectUrl, divId = undefined) {
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

            setUpLoginForm(redirectUrl);
        });
}

function goToLoginForm(redirectUrl) {
    window.location.href = 'http:localhost:8080/web-nexus/src/pages/login_form.html';
    setUpLoginForm();
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
    }

    return new Promise((resolve, reject) => {
        fetch(backendLoginEndpoint, requestOptions)
            .then((response) => {
                if (response.status === 404) {
                    reject(showWrongCredentialsPopupModal);
                }
                if (response.status === 500) {
                    reject(() => {
                        window.location.href = 'http://localhost:63342/web-nexus/sdk/pages/internal-server-error-page.html';
                    })
                }
                if (!response.ok) {
                    reject(() => {
                        console.log(`Server returned ${response.status}`);
                    })
                }

                return response.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject((error) => {
                    console.log(error);
                });
            })
    })
}

async function showWrongCredentialsPopupModal() {
    const body = await fetch(wrongCredentialsPage).then((result) => result.text());

    return function createModal() {
        const modalDiv = document.getElementById('wrongCredentialsModal');
        modalDiv.innerHTML = body;
        modalDiv.style.display = 'block';

        const span = document.querySelector('.close');

        span.addEventListener('click', function () {
            modalDiv.style.display = 'none';
        });

        window.addEventListener('click', function (event) {
            if (event.target === modalDiv) {
                modalDiv.style.display = 'none';
            }
        });
    };
}

module.exports = {createLoginForm, goToLoginForm};
