const express = require('express');
const { getTopics, getEndpoints } = require('./controller/news-controller');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints)

app.all('*', (req, res, next) => {
    res.status(404).send({ message: "Not found" });
});

module.exports = app;