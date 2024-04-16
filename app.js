const express = require('express');
const app = express();
const { getTopics } = require('./controller/news-controller');

app.get('/api/topics', getTopics);

app.all('*', (req, res, next) => {
    res.status(404).send({message: "Not found"});
});

module.exports = app;   