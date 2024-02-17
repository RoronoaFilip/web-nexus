const { createTransformStream } = require("../../core/utils/file_streams/file_transform");
const { responseHandlers } = require("../../core/utils/response_handlers");
const { createFileReadStream } = require("../../core/utils/file_streams/file_read_stream");
const chatService = require('../../core/service/chat-service');
const router = require('express').Router();

/**
 * Fetch the Chat Box. Replaces all instances of {{name}} with the name.
 * Notice the IDs of all HTML elements. These are used by the WebNexus SDK to Determine in whose chat box to append the message.
 */
router.post('/', (req, res) => {
  const replacementMap = {
    name: req.body.name,
  };

  console.log('This is', chatService.dummy());

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

router.get('/css', (req, res) => {
  const readStream = createFileReadStream(__dirname + '/../../pages/chat_box.css');
  readStream.pipe(res);
});

router.post('/set-chat-details', (req, res) => {
  const { from, to } = req.body;
  chatService.setChatDetails(from, to, 0)
    .then((message) => res.status(200).send(message))
    .catch((message) => res.status(400).send(message));
});

router.post('/get-messages', async (req, res) => {
  const {from, to} = req.body;
  const messages = await chatService.getMessages(from, to)

  if (messages) {
    console.log(messages);
    res.status(200).send(messages);
    return;
  }

  res.status(404).send('User/s not found!');
})

module.exports = router;