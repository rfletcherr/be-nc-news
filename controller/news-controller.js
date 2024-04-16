const { fetchTopics } = require('../models/news-model')

const getTopics = (request, response, next) => {
    fetchTopics()
    .then((topics) => {
        response.status(200).send({ topics })
    }).catch(next)
}
module.exports = { getTopics }
