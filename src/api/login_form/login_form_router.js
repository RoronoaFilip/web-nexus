const { createFileReadStream } = require("../../utils/file_streams/file_read_stream");
const { responseHandlers } = require("../../utils/response_handlers");
const router = require('express').Router();

/**
 * Fetch the Login Form
 */
router.get('/', (req, res) => {
  const filePath = __dirname + '/../../pages/login_form.html';

  const readStream = createFileReadStream(filePath)
    .on('error', (err) => {
      console.log(err);
      responseHandlers.internalServer(res, err);
    });

  res.setHeader('Content-Type', 'text/html');
  readStream.pipe(res);
});

module.exports = router;