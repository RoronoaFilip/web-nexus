const infiniteScrollV1 = require('./infinite_scroll.js');
const Error = infiniteScrollV1.Error;
const CallbacksBuilder = infiniteScrollV1.CallbacksBuilder;
const InfiniteScroll = infiniteScrollV1.InfiniteScroll;


class InfiniteScrollV2 extends InfiniteScroll {
  /**
   * The SetUp Function. Configure the Infinite Scroll.
   * @param divId string, required
   * @param rawDiv string, required
   * @param divStyling string, required
   * @returns the ConfigResponse Object for setting the before and after callbacks
   */
  // @Override
  setupV2(
    divId, rawDiv, divStyling,
  ) {
    return new Promise((resolve, reject) => {
      this.config.divId = divId;
      this.config.rawDiv = rawDiv;
      this.config.divStyling = divStyling;

      const errors = this.validateConfiguration(this.config);

      if (errors.length > 0) {
        reject(errors);
        return;
      }

      document.getElementById(divId).innerHTML += divStyling;

      resolve(new CallbacksBuilder((callbacks) => {
        this.config = { ...this.config, ...callbacks };
        this.config.load = this.loadMoreContent.bind(this);
        window.addEventListener('scroll', this.setupScrollCallback(this.config.load));
        this.config.load();
      }));
    });
  }

  // @Override
  handleArrayV2(arr, rawDiv) {
    let div = '';

    arr.forEach((obj) => {
      div += this.handleObject(obj, rawDiv);
    });

    return div;
  }

  // @Override
  handleObject(obj, rawDiv) {
    const keys = Object.keys(obj);

    keys.forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rawDiv = rawDiv.replace(regex, obj[key]);
    });

    return rawDiv;
  }

  // @Override
  loadMoreContent() {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;

    new Promise((resolve, reject) => {
      if (!this.config.before) {
        reject(new Error('The before callback is not set'));
      }
      let replacementMap = {};

      let result = this.config.before(replacementMap);
      result = result || replacementMap;

      if (result instanceof Promise) {
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
          div = this.handleArrayV2(replacementMap, this.config.rawDiv);
        } else if (typeof replacementMap === 'object') {
          div = this.handleObject(replacementMap, this.config.rawDiv);
        } else {
          throw new Error('The replacement map is not an array or an object');
        }

        if (!div || div === this.rawDiv) {
          throw new Error('The replacement map is empty');
        }

        this.appendNewsBox(div);
        this.config.after && this.config.after(replacementMap);
      })
      .catch((err) => {
        this.config.onError && this.config.onError(err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

delete InfiniteScrollV2.prototype.handleArray;
delete InfiniteScrollV2.prototype.setup;

const configureInfiniteScrollV2 = new InfiniteScrollV2();
const setupFunction = configureInfiniteScrollV2.setupV2.bind(configureInfiniteScrollV2);
module.exports = { setupFunction };