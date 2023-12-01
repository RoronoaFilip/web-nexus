const { createTransformStream } = require("../../utils/file_streams/file_transform");
const { responseHandlers } = require("../../utils/response_handlers");
const { createFileReadStream } = require("../../utils/file_streams/file_read_stream");
const router = require('express').Router();

/**
 * Fetch the Chat Box. Replaces all instances of {{name}} with the name.
 * Notice the IDs of all HTML elements. These are used by the WebNexus SDK to Determine in whose chat box to append the message.
 */
router.post('/', (req, res) => {
  const replacementMap = {
    name: req.body.name,
  };

  const readStream = createFileReadStream(__dirname + '/../../pages/chat_box.html');
  const transformStream = createTransformStream(replacementMap);

  readStream.on('error', (err) => {
    responseHandlers.internalServer(req, res);
    res.send(err);
  });

  transformStream.on('error', (err) => {
    responseHandlers.internalServer(req, res);
    res.send(err);
  });

  res.setHeader('Content-Type', 'text/html');
  readStream.pipe(transformStream).pipe(res);
});

module.exports = router;