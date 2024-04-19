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

const fetchComments = (article_id) => {
    return db.query(
        `SELECT
            comments.comment_id,
            comments.votes,
            comments.created_at,
            comments.author,
            comments.body, 
            comments.article_id
            FROM comments
            WHERE article_id = $1   
            ORDER BY comments.created_at DESC
            ;`, [article_id])
        .then(({ rows }) => {
            return {comments: rows};
        });
}
const checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, message: 'Article not found' })
            } else {
                return true
            }
        });
}



module.exports = { fetchTopics, fetchArticle, fetchAllArticles, fetchComments, checkArticleExists };