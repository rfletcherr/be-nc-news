const db = require('../db/connection');

const fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return rows;
        });
};
const fetchArticle = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: "Not found" });
            }
            return rows[0];
        });
}
const fetchAllArticles = () => {
    return db.query(`SELECT 
    articles.author,
    articles.title, 
    articles.article_id,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
    COUNT(comment_id) :: INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC
;`).then(({ rows }) => {
    return { articles: rows }
})
}

module.exports = { fetchTopics, fetchArticle, fetchAllArticles };