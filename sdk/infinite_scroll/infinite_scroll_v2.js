const common = require('./common');

delete common.ConfigBuilder.prototype.onSuccess;
delete common.config.onSuccess;

/**
 * The SetUp Function. Configure the Infinite Scroll.
 * @param divId string, required
 * @param rawDiv string, required
 * @param divStyling string, required
 * @returns the ConfigResponse Object for setting the before and after callbacks
 */
function configureInfiniteScrollV2(
  divId, rawDiv, divStyling,
) {
  return new Promise((resolve, reject) => {
    common.config.divId = divId;
    common.config.rawDiv = rawDiv;
    common.config.divStyling = divStyling;

    const errors = common.validateConfiguration(common.config);

    if (errors.length > 0) {
      reject(errors);
      return;
    }

    document.getElementById(divId).innerHTML += divStyling;

    window.addEventListener('scroll', common.scrollCallback);

    resolve(new common.ConfigBuilder(loadMoreContent));
  });
}

function handleArray(arr, rawDiv) {
  let div = '';

  arr.forEach((obj) => {
    div += handleObject(obj, rawDiv);
  });

  return div;
}

function handleObject(obj, rawDiv) {
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    rawDiv = rawDiv.replace(regex, obj[key]);
  });

  return rawDiv;
}

let isLoading = false;

function loadMoreContent() {
  if (isLoading) {
    return;
  }
  isLoading = true;

  new Promise((resolve, reject) => {
    if (!this.before) {
      reject(new common.Error('The before callback is not set'));
    }
    let replacementMap = {};

    let result = this.before(replacementMap);
    result = result || replacementMap;

    if(result instanceof Promise) {
      result.then((replacementMap) => {
        resolve(replacementMap);
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve(result);
    }
  })
    .then((replacementMap) => {
      let div = '';
      if (Array.isArray(replacementMap)) {
        div = handleArray(replacementMap, this.rawDiv);
      } else if (typeof replacementMap === 'object') {
        div = handleObject(replacementMap, this.rawDiv);
      } else {
        throw new common.Error('The replacement map is not an array or an object');
      }

      if (!div || div === this.rawDiv) {
        throw new common.Error('The replacement map is empty');
      }

      common.appendNewsBox(div);
      this.after && this.after(replacementMap);
    })
    .catch((err) => {
      this.onError && this.onError(err);
    })
    .finally(() => {
      isLoading = false;
    });
}

module.exports = { configureInfiniteScrollV2 };