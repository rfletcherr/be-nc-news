const db = require('../db/connection');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
    .then(({ rows }) => {
        return rows;
    });
};
function fetchArticle(article_id) {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, message: "Article Not Found" });
        }
        return rows[0];
    });
}

module.exports = { fetchTopics, fetchArticle};