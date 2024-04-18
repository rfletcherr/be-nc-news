const express = require('express');
const { getTopics, getEndpoints, getArticle, getAllArticles, getComments, } = require('./controller/news-controller');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticle)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found' });
});

module.exports = app;