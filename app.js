const express = require('express');
const { getTopics, getEndpoints, getArticle, getAllArticles, getComments, postComment, patchArticle, deleteComment, getUsers} = require('./controller/news-controller');

const app = express();

app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticle)

app.patch('/api/articles/:article_id', patchArticle)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id/comments', getComments)

app.post('/api/articles/:article_id/comments', postComment)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)

app.all('*', (req, res, next) => {
    res.status(404).send({ message: 'Not found' });
});

module.exports = app;