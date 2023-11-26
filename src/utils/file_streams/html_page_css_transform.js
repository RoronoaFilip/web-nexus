const stream = require('stream');
const fs = require('fs');
const {transformText} = require('../transform_text');

/**
 * Creates a transform stream that replaces all instances
 * of {{key}} in the target stream with the value of.
 * This function must be called for an HTML file and will try to read a CSS file on the same path.
 * The Transform Stream will place the CSS file's contents in the <style> tag of the HTML file.
 * @param pageName - the name of the page to transform
 * @param replacementMap - the map of keys to values
 * @returns a Transform stream
 */
function createTransformStream(pageName, replacementMap) {
  const transformStream = new stream.Transform({
    encoding: 'utf8',
    buffer: '',
    transform(chunk, encoding, cb) {
      const chunkString = chunk.toString();
      this.buffer = (this.buffer || '') + chunkString;

      if (this.buffer.includes('<style>')) {
        this.handleCssFile(cb);
      } else if (this.buffer.includes('\n')) {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop();

        for (const i in lines) {
          this.push(transformText(replacementMap, lines[i]) + '\n');
        }

        return cb();
      } else {
        return cb();
      }
    },
    flush(cb) {
      if (this.buffer) {
        const transformedLine = transformText(replacementMap, this.buffer);
        this.push(transformedLine);
      }
      replacementMap = {};
      return cb();
    }
  });

  transformStream.handleCssFile = function handleCssFile(cb) {
    let splitBuffer = this.buffer.split('<style>');
    this.push(splitBuffer[0] + '<style>');

    let transformStream = this;
    fs.createReadStream('pages/main.css',
        {highWaterMark: 1024, encoding: 'utf8'})
        .on('data', function readChunk(chunk) {
          transformStream.push(chunk);
        })
        .on('end', function callCb() {
          cb();
        });

    this.buffer = splitBuffer[1] || '';
  };

  transformStream.cssFilePath = `./pages/${pageName}.css`;

  return transformStream;
}

module.exports = {createTransformStream}