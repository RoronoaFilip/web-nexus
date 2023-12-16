const common = require('./common');

const urlRegex = /^https:\/\/(?:www\.)?([\w-]+\.)+(com|org|bg)(?:\/[\w-]+)*(?:[?&]([^%^&*$#@!?\s]+=[^%^&*$#@!?\s]*))*$/;


// The Configuration related to the Request for the Data
let requestConfig = {
  url: '',
  method: '',
  body: {},
  headers: {},
  replacementMap: {},
};

/**
 * Validation of the configuration
 */
function validateConfiguration(config, requestConfig) {
  const errors = common.validateConfiguration(config);

  if (requestConfig.url && !requestConfig.url.match(urlRegex)) {
    errors.push(new Error('Invalid URL'));
  }

  return errors;
}

/**
 * The SetUp Function. Configure the Infinite Scroll.
 * @param divId string, required
 * @param rawDiv string, required
 * @param divStyling string, required
 * @param replacementMap object, optional
 * @param url string, optional
 * @param method string, optional
 * @param headers object, optional
 * @param body object, optional
 * All Optional Parameters can be set in the before callback and deleted in the after callback
 * @returns the ConfigResponse Object for setting the before and after callbacks
 */
function configureInfiniteScroll(
  divId, rawDiv, divStyling,
  replacementMap = null, url = null, method = null, headers = null, body = null
) {
  return new Promise((resolve, reject) => {
    common.config.divId = divId;
    common.config.rawDiv = rawDiv;
    common.config.divStyling = divStyling;
    requestConfig = { replacementMap, url, method, headers, body };

    const errors = validateConfiguration(common.config, requestConfig);

    if (errors.length > 0) {
      reject(errors);
      return;
    }

    document.getElementById(divId).innerHTML += divStyling;

    window.addEventListener('scroll', common.scrollCallback);

    resolve(new common.ConfigBuilder(loadMoreContent));
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
  let rawDiv = common.config.rawDiv;

  for (const key in obj) {
    rawDiv = handleKey(key, obj[key], replacementMap, rawDiv);
  }
  return rawDiv;
}

function handleArray(arr, replacementMap) {
  for (const item of arr) {
    if (typeof item === 'object') {
      const rawDiv = handleObject(item, replacementMap);

      if (rawDiv !== common.config.rawDiv) {
        common.appendNewsBox(rawDiv);
      }
    }
  }
}

/**
 * Loads more content. Gets called when the User has scrolled to the bottom.
 * This Function expects the response to be a JSON. It only cares for the keys in the replacementMap.
 *
 * Executes the before callback, then fetches the data.
 *
 * Tries to replace all the keys in the `replacementMap` with the value from the response related to said key.
 * If the value from the Response is an array, it tries to replace all the keys in the `replacementMap` for each object in the array.
 * If the value from the Response is an object, it tries to replace all the keys in the `replacementMap` for the object.
 *
 * The `replacementMap` has the layout of the Response.
 * The `replacementMap` is an object with keys and values. The Values are either a boolean(true) or an object.
 * The Keys of the Response are iterated and if they are present in the `replacementMap` the following occurs:
 *    - if the value in the `replacementMap` is true(boolean), the key will be replaced with the value from the response.
 *    - if the value in the response is an array(1), the value in the `replacementMap` must be an object, and
 *          it will be used as a `replacementMap` for each object in the array(1).
 *    - if the value in the response is an object(1), the value in the `replacementMap` must be an object, and
 *          it will be used as a `replacementMap` for the object(1).
 *
 * Example:
 * Response:
 * ```json
 * {
 *   length: 25,
 *   articles: [
 *     {
 *       author: 'author1',
 *       title: 'title1',
 *       description: 'description1',
 *       url: 'url1',
 *     },
 *     {
 *       author: 'author2',
 *       title: 'title2',
 *       description: 'description2',
 *       url: 'url2',
 *     },
 *     {
 *       author: 'author3',
 *       title: 'title3',
 *       description: 'description3',
 *       url: 'url3',
 *     }
 *   ]
 * }
 * ```
 *
 * For Example, we want to use only the values of the keys title and description.
 * A valid `replacementMap` would be:
 * ```json
 * {
 *   articles: {
 *      title: true,
 *      description: true,
 *   }
 * }
 * ```
 *
 * Executes the after callback.
 */
let isLoading = false;
function loadMoreContent() {
  if (isLoading) {
    return;
  }
  isLoading = true;

  this.before && this.before(requestConfig);

  fetch(requestConfig.url, {
    method: requestConfig.method.toUpperCase(),
    headers: requestConfig.headers || { 'Accept': 'application/json' },
    body: requestConfig.body && JSON.stringify(requestConfig.body),
  })
    .then(body => body.json())
    .then(response => {
      if (Array.isArray(response)) {
        handleArray(response, requestConfig.replacementMap);
      } else if (typeof response === 'object') {
        handleObject(response, requestConfig.replacementMap);
      }
      this.onSuccess && this.onSuccess(response);
    })
    .catch(err => this.onError && this.onError(err))
    .finally(() => {
      isLoading = false;
      this.after && this.after(requestConfig);
    });
}

module.exports = { configureInfiniteScroll };