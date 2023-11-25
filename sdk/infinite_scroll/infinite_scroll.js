const urlRegex = /^https:\/\/(?:www\.)?([\w\d-]+\.)+(com|org|bg)(?:\/[\w\d-]+)*(?:[?&]([^%^&*$#@!?\s]+=[^%^&*$#@!?\s]*))*$/;
const rawDivRegex = /^\s*[\w\W]*<div[\w\W]*>[\w\W]*<\/div>\s*$/;
const divStylingRegex = /^\s*<style>[\w\W]*<\/style>\s*$/;

let config = {
  divId: '',
  rawDiv: '',
  beforeLoad: () => {
  },
  afterLoad: () => {
  },
};

let requestConfig = {
  url: '',
  method: '',
  body: {},
  headers: {},
  replacementMap: {},
};

const configResponse = {
  before,
  after,
  load,
};

let isLoading = false;

class Error {
  constructor(message) {
    this.message = message;
  }
}

function before(cb) {
  config.beforeLoad = cb;

  return configResponse;
}

function after(cb) {
  config.afterLoad = cb;

  return configResponse;
}

function load() {
  loadMoreContent();
}

function validateConfiguration(config, requestConfig) {
  const errors = [];

  if (!config.rawDiv || !config.rawDiv.match(rawDivRegex)) {
    errors.push(new Error('Invalid Raw Div'));
  }

  if (!config.divStyling || !config.divStyling.match(divStylingRegex)) {
    errors.push(new Error('Invalid Raw Div'));
  }

  if (requestConfig.url && !requestConfig.url.match(urlRegex)) {
    errors.push(new Error('Invalid URL'));
  }

  return errors;
}

function configureInfiniteScroll(
    divId, rawDiv, divStyling,
    replacementMap = null, url = null, method = null, headers = null, body = null
) {
  return new Promise((resolve, reject) => {
    config = {divId, rawDiv, divStyling};
    requestConfig = {replacementMap, url, method, headers, body};

    const errors = validateConfiguration(config, requestConfig);

    if (errors.length > 0) {
      reject(errors);
      return;
    }

    document.getElementById(divId).innerHTML += divStyling;

    window.addEventListener('scroll', () => {
      const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreContent();
      }
    });

    resolve(configResponse);
  });
}

function appendNewsBox(div) {
  const contentDiv = document.getElementById(config.divId);
  contentDiv.innerHTML += div;
}

function loadMoreContent() {
  if (isLoading) {
    return;
  }
  isLoading = true;

  if (config.beforeLoad) {
    config.beforeLoad(requestConfig);
  }

  fetch(requestConfig.url, {
    method: requestConfig.method.toUpperCase(),
    headers: requestConfig.headers || {'Accept': 'application/json'},
    body: requestConfig.body && JSON.stringify(requestConfig.body),
  })
      .then(response => response.json())
      .then(body => {
        if (Array.isArray(body)) {
          handleArray(body, requestConfig.replacementMap);
        } else if (typeof body === 'object') {
          handleObject(body, requestConfig.replacementMap);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        isLoading = false;
        if (config.afterLoad) {
          config.afterLoad(requestConfig);
        }
      });
}

function handleKey(key, value, replacementMap, rawDiv) {
  const replacementMapElement = replacementMap[key];

  if (!replacementMapElement) {
    return rawDiv;
  }

  if (replacementMapElement === true) {
    rawDiv = rawDiv.replace('{{' + key + '}}', value);
  } else if (Array.isArray(value)) {
    handleArray(value, replacementMapElement);
  } else if (typeof value === 'object') {
    rawDiv = handleObject(value, replacementMapElement);
  }

  return rawDiv;
}

function handleObject(obj, replacementMap) {
  let rawDiv = config.rawDiv;

  for (const key in obj) {
    rawDiv = handleKey(key, obj[key], replacementMap, rawDiv);
  }
  return rawDiv;
}

function handleArray(arr, replacementMap) {
  for (const item of arr) {
    if (typeof item === 'object') {
      const rawDiv = handleObject(item, replacementMap);

      if (rawDiv !== config.rawDiv) {
        appendNewsBox(rawDiv);
      }
    }
  }
}

module.exports = {configureInfiniteScroll};