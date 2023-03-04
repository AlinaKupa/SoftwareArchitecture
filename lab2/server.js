//server.js
const express = require('express');
const app = express();

app.use("/", (req, res) => {
    res.send({message: 'Hello World!'});
    res.end();

});

module.exports = app;
