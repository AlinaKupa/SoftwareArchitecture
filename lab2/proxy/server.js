const express = require('express');
const axios = require('axios');
const config = require('./config');

const app = express();

app.get('/', async (req, res) => {
  try {
    const { data } = await axios.get(`${config.get('apiUrl')}/`);
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(config.get('port'), () => {
  console.log(`Server listening on port ${config.get('port')}`);
});
