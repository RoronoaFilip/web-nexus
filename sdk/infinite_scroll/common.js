const rawDivRegex = /^\s*[\w\W]*<div[\w\W]*>[\w\W]*<\/div>\s*$/;
const divStylingRegex = /^\s*<style>[\w\W]*<\/style>\s*$/; // The Configuration for the Infinite Scroll

let config = {
  divId: '',
  rawDiv: '',
  before: undefined, // gets called before the request is made
  onSuccess: undefined, // gets called when the request is successful
  onError: undefined, // gets called when an error occurs
  after: undefined, // gets called after the request is made
  load: undefined,
};

class Error {
  constructor(message) {
    this.message = message;
  }
}

class ConfigBuilder {
  constructor(loadMoreContent) {
    this.start = () => {
      config.load = loadMoreContent.bind(config);
      config.load();
    };
  }

  // set the callback before the request is made
  before(cb) {
    config.before = cb;

    return this;
  }

  // set the callback when the request is successful
  onSuccess(cb) {
    config.onSuccess = cb;

    return this;
  }

  // set the callback when an error occurs
  onError(cb) {
    config.onError = cb;

    return this;
  }

  // set the callback after the request is made
  after(cb) {
    config.after = cb;

    return this;
  }
}

/**
 * Validation of the configuration
 */
function validateConfiguration(config) {
  const errors = [];

  if (!config.rawDiv || !config.rawDiv.match(rawDivRegex)) {
    errors.push(new Error('Invalid Raw Div'));
  }

  if (!config.divStyling || !config.divStyling.match(divStylingRegex)) {
    errors.push(new Error('Invalid Raw Div'));
  }

  return errors;
}

function appendNewsBox(div) {
  const contentDiv = document.getElementById(config.divId);
  contentDiv.innerHTML += div;
}

const scrollCallback = () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  // Check if the user has scrolled to the bottom
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    config.load();
  }
};

module.exports = { appendNewsBox, validateConfiguration, config, scrollCallback, ConfigBuilder };