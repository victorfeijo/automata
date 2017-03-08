const express = require('express');
const path = require('path');

const app = express();
const publicDir = __dirname + '/dist';
const port = process.env.PORT || 3000;

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.render('error', { error: err });
}

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, '/index.html'));
});

app.use(errorHandler);
app.use(express.static(__dirname + '/dist'));

app.listen(port, () => {
  console.log('Starting server on port  ' + port);
});
