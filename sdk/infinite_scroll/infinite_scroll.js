let config = {
  divId: '',
  rawDiv: '',
  replacementMap: {},
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
};

const configResponse = {
  before,
  after
};

let isLoading = false;

class Error {
  constructor(message) {
    this.message = message;
  }
}

function before(cb) {
  // cb({url, method, headers, body});
  config.beforeLoad = cb;

  return configResponse;
}

function after(cb) {
  // cb({url, method, headers, body});
  config.afterLoad = cb;

  return configResponse;
}

function validateConfiguration(config, requestConfig) {
  const errors = [];

  if (!config.rawDiv || !config.rawDiv.match(/^(<style>[\w\W]*<\/style>)?[\w\W]*<div[\w\W]*>[\w\W]*<\/div>$/)) {
    errors.push(new Error('Invalid Raw Div'));
  }

  if (!requestConfig.url) {
    errors.push(new Error('Invalid URL'));
  }

  return errors;
}

function configureInfiniteScroll(divId, rawDiv, replacementMap, url, method, headers, body = null) {
  return new Promise((resolve, reject) => {
    config = {divId, rawDiv, replacementMap};
    requestConfig = {url, method, headers, body};

    const errors = validateConfiguration(config, requestConfig);

    if (errors.length > 0) {
      reject(errors);
      return;
    }

    window.addEventListener('scroll', () => {
      const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMoreContent();
      }
    });

    resolve(configResponse);

    loadMoreContent();
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
    setTimeout(() => {
      config.beforeLoad(requestConfig);
    });
  }

  fetch(requestConfig.url, {
    method: requestConfig.method.toUpperCase(),
    headers: requestConfig.headers,
    body: requestConfig.body && JSON.stringify(requestConfig.body),
  }).then(response => response.json())
      .then(body => {
        if (Array.isArray(body)) {
          handleArray(body);
        } else if (typeof body === 'object') {
          handleObject(body);
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

function handleKey(key, value, rawDiv) {
  const shouldReplace = config.replacementMap[key];

  if (!shouldReplace) {
    return rawDiv;
  }

  if (shouldReplace === true) {
    rawDiv = rawDiv.replace('{{' + key + '}}', value);
  } else if (Array.isArray(value)) {
    handleArray(value, rawDiv);
  } else if (typeof value === 'object') {
    rawDiv = handleObject(value);
  }

  return rawDiv;
}

function handleObject(obj) {
  let rawDiv = config.rawDiv;

  for (const key in obj) {
    rawDiv = handleKey(key, obj[key], rawDiv);
  }
  return rawDiv;
}

function handleArray(arr) {
  for (const item of arr) {
    if (typeof item === 'object') {
      const rawDiv = handleObject(item);

      if (rawDiv !== config.rawDiv) {
        appendNewsBox(rawDiv);
      }
    }
  }
}

module.exports = {configureInfiniteScroll};