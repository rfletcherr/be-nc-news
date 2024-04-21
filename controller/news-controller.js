const { fetchTopics, fetchArticle, fetchAllArticles, fetchComments, checkArticleExists, insertComment, insertArticle} = require('../models/news-model');
const endpoints = require('../endpoints.json');

function getEndpoints(req, res, next) {
    return res.status(200).send(endpoints);
}

const getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({ topics });
    }).catch(next);
};

function getArticle(req, res, next) {
    const { article_id } = req.params
    return fetchArticle(article_id)
    .then((article) =>{
        res.status(200).send({ article })
    }).catch(next)
}
function getAllArticles(req, res, next) {
    fetchAllArticles()
    .then((articles) => { 
        res.status(200).send(articles);
    }).catch(next);
}
function getComments(req, res, next) {
    const { article_id } = req.params;
    Promise.all([fetchComments(article_id), checkArticleExists(article_id)])
        .then((array) => {
            res.status(200).send({ comments: array[0] });
        }).catch(next);
}
function postComment(req, res, next) {
    const { article_id } = req.params
    const { body } = req
    return insertComment(article_id, body)
    .then((comment) => {
        res.status(201).send({ comment })
    }).catch(next)              
}
function patchArticle(req, res, next) {
    const { article_id } = req.params
    const { inc_votes } = req.body
    insertArticle(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    }).catch(next)
}

module.exports = { getTopics, getEndpoints, getArticle, getAllArticles, getComments, postComment, patchArticle};    