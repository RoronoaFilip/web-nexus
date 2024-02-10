const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use((req, res, next) => {
  if(req.url.includes('/favicon.ico')) {
    return res.status(404).end();
  }
  next();
});

app.get('/:file', (req, res) => {
  let options = {
    file: req.params.file || 'main'
  };

  if (req.params.file === 'main') {
    options.file = undefined;
  }

  res.render('main', options);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});