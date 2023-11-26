const {responseHandlers} = require("../../utils/response_handlers");
const {createFileReadStream} = require("../../utils/file_streams/file_read_stream");
const router = require('express').Router();

/**
 * Fetch the WebNexus SDK
 */
router.get('/', function (req, res) {
  const filePath = __dirname + '/../../../dist/bundle.js';

  const readStream = createFileReadStream(filePath)
      .on('error', (err) => {
        console.log(err);
        responseHandlers.internalServer(res, err);
      });

  res.setHeader('Content-Type', 'application/javascript');
  readStream.pipe(res);
});

module.exports = router;