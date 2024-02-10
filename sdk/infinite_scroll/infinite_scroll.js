const urlRegex = /^https:\/\/(?:www\.)?([\w-]+\.)+(com|org|bg)(?:\/[\w-]+)*(?:[?&]([^%^&*$#@!?\s]+=[^%^&*$#@!?\s]*))*$/;
const rawDivRegex = /^\s*[\w\W]*<div[\w\W]*>[\w\W]*<\/div>\s*$/;
const divStylingRegex = /^\s*<style>[\w\W]*<\/style>\s*$/; // The Configuration for the Infinite Scroll

class InfiniteScroll {
  isLoading = false;

  // The Configuration related to the Request for the Data
  requestConfig = {
    url: '',
    method: '',
    body: {},
    headers: {},
    replacementMap: {},
  };

  config = {
    divId: '',
    rawDiv: '',
    divStyling: '',
  };


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
  setup(
    divId, rawDiv, divStyling = null,
    replacementMap = null, url = null, method = null, headers = null, body = null
  ) {
    return new Promise((resolve, reject) => {
      this.config.divId = divId;
      this.config.rawDiv = rawDiv;
      this.requestConfig = { replacementMap, url, method, headers, body };

      const errors = this.validateConfiguration(this.config, this.requestConfig);

      if (errors.length > 0) {
        reject(errors);
        return;
      }

      this.attachCss(divStyling);

      resolve(new CallbacksBuilder((callbacks) => {
        this.config = { ...this.config, ...callbacks };
        this.config.load = this.loadMoreContent.bind(this);
        window.addEventListener('scroll', this.setupScrollCallback(this.config.load));
        this.config.load();
      }));
    });
  }

  attachCss(divStyling) {
    if (divStyling) {
      if (!divStyling.match(divStylingRegex)) {
        divStyling = `<style>${divStyling}</style>`;
      }
      document.head.innerHTML += divStyling;
    }
    return divStyling;
  }

  handleKey(key, value, replacementMap, rawDiv) {
    const replacementMapElement = replacementMap[key];

    if (!replacementMapElement) {
      return rawDiv;
    }

    if (replacementMapElement === true) {
      rawDiv = rawDiv.replace('{{' + key + '}}', value);
    } else if (Array.isArray(value)) {
      this.handleArray(value, replacementMapElement);
    } else if (typeof value === 'object') {
      rawDiv = this.handleObject(value, replacementMapElement);
    }

    return rawDiv;
  }

  handleObject(obj, replacementMap) {
    let rawDiv = this.config.rawDiv;

    for (const key in obj) {
      rawDiv = this.handleKey(key, obj[key], replacementMap, rawDiv);
    }
    return rawDiv;
  }

  handleArray(arr, replacementMap) {
    for (const item of arr) {
      if (typeof item === 'object') {
        const rawDiv = this.handleObject(item, replacementMap);

        if (rawDiv !== this.config.rawDiv) {
          this.appendNewsBox(rawDiv);
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
  loadMoreContent() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    this.config.before && this.config.before(this.requestConfig);

    fetch(this.requestConfig.url, {
      method: this.requestConfig.method.toUpperCase(),
      headers: this.requestConfig.headers || { 'Accept': 'application/json' },
      body: this.requestConfig.body && JSON.stringify(this.requestConfig.body),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        return Promise.reject(response);
      })
      .then(response => {
        if (Array.isArray(response)) {
          this.handleArray(response, this.requestConfig.replacementMap);
        } else if (typeof response === 'object') {
          this.handleObject(response, this.requestConfig.replacementMap);
        }
        this.config.onSuccess && this.config.onSuccess(response);
      })
      .catch(err => this.config.onError && this.config.onError(err))
      .finally(() => {
        this.isLoading = false;
        this.config.after && this.config.after(this.requestConfig);
      });
  }

  /**
   * Validation of the configuration
   */
  validateConfiguration(config) {
    const errors = [];

    if (this.requestConfig.url && !this.requestConfig.url.match(urlRegex)) {
      errors.push(new Error('Invalid URL'));
    }

    if (!config.rawDiv || !config.rawDiv.match(rawDivRegex)) {
      errors.push(new Error('Invalid Raw Div'));
    }

    return errors;
  }

  appendNewsBox(div) {
    const contentDiv = document.getElementById(this.config.divId);
    contentDiv.innerHTML += div;
  }

  setupScrollCallback(cb) {
    return function onEndOfPage() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // Check if the user has scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        cb();
      }
    };
  }
}


class Error {
  constructor(message) {
    this.message = message;
  }
}

class CallbacksBuilder {
  callbacks = {
    before: undefined, // gets called before the request is made
    onSuccess: undefined, // gets called when the request is successful
    onError: undefined, // gets called when an error occurs
    after: undefined, // gets called after the request is made
  };

  constructor(configCallback) {
    this.start = () => {
      configCallback(this.callbacks);
    };
  }

  // set the callback before the request is made
  before(cb) {
    this.callbacks.before = cb;

    return this;
  }

  // set the callback when the request is successful
  onSuccess(cb) {
    this.callbacks.onSuccess = cb;

    return this;
  }

  // set the callback when an error occurs
  onError(cb) {
    this.callbacks.onError = cb;

    return this;
  }

  // set the callback after the request is made
  after(cb) {
    this.callbacks.after = cb;

    return this;
  }
}

const infiniteScroll = new InfiniteScroll();
const setupFunction = infiniteScroll.setup.bind(infiniteScroll);
module.exports = { setupFunction, InfiniteScroll, Error, CallbacksBuilder };