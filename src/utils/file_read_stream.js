const fs = require('fs');

/**
 * Create a simple File read Stream
 * @param path - the Path to the File
 * @returns {ReadStream} - the ReadStream for the File
 */
function createFileReadStream(path) {
    return fs.createReadStream(path, {encoding: 'utf-8', highWaterMark: 1024});
}

module.exports = {createFileReadStream};