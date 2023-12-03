const stream = require('stream');
const { transformText } = require('../transform_text');

/**
 * Creates a Transform stream that replaces all instances of {{key}}
 * in the File with the value of replacementMap[key]
 *
 * @param replacementMap the map of keys to values
 * @return a Transform stream for the File
 */
function createTransformStream(replacementMap) {
  replacementMap = replacementMap || {};
  return new stream.Transform({
    encoding: 'utf8',
    buffer: '',
    transform(chunk, encoding, cb) {
      const chunkString = chunk.toString();
      this.buffer = (this.buffer || '') + chunkString;

      if (this.buffer.includes('\n')) {
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop();

        for (const i in lines) {
          this.push(transformText(replacementMap, lines[i]) + '\n');
        }

        return cb();
      }

      return cb();
    },
    flush(cb) {
      if (this.buffer) {
        const transformedLine = transformText(replacementMap, this.buffer);
        this.push(transformedLine);
      }
      replacementMap = {};
      return cb();
    },
  });
}

module.exports = { createTransformStream };
