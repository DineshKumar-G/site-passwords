const express = require('express');
const cowsay = require('cowsay');
const cors = require('cors');
const path = require('path');
const route = require('./routes');
const mongoose = require('./mongoose');
const bodyParser = require('body-parser');

// Create the server
const app = express();

// Serve static files from the Vue frontend app
app.use(express.static(path.join(__dirname, 'client/dist')));

app.use(bodyParser.json({ limit: '20mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '20mb',
    extended: true,
  })
);
app.use(cors());
app.use(route);

// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Choose the port and start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`);
});
