const { fetchTopics } = require('../models/news-model');
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

module.exports = { getTopics, getEndpoints };