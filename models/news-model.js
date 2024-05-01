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
const fetchAllArticles = (topic, sort_by='created_at', order='DESC') => {
    let sqlQuery = `SELECT
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id `;

    let queryVals = [];

    if (topic) {
        sqlQuery += `WHERE articles.topic = $1 `;
        queryVals.push(topic);
    }

    sqlQuery += `GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

    return db.query(sqlQuery, queryVals)
    .then(({ rows }) => {
        return { articles: rows };
    });
};

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
const insertComment = (article_id, body) => {
        return db.query(`INSERT INTO comments(article_id, author, body)
        VALUES ($1, $2, $3) 
        RETURNING *;`, [article_id, body.username, body.body ])
        .then(({ rows }) => {
            return rows[0]
        })
    }
const insertArticle = (newVotes, article_id) => {
        return db.query(`UPDATE articles SET votes= votes + $1
        WHERE article_id=$2
        RETURNING *;`, [newVotes, article_id])
        .then(({ rows }) => {
            if(!rows.length) {
                return Promise.reject({status: 400, message: 'Not found'})
            }
            return rows[0]
        })
    }
const commentDeletion = (comment_id) => {
        return db.query(
            `DELETE FROM comments WHERE comment_id = $1
            RETURNING *
            ;`, [comment_id])
            .then(({ rows }) => {
                if (!rows.length) {
                    return Promise.reject
                        ({status: 404, message: 'Not found'})
                }
                return rows
            })
        }
const fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then(({ rows }) => {
        return rows
    })
 }

        

module.exports = { fetchTopics, fetchArticle, fetchAllArticles, fetchComments, checkArticleExists, insertComment, insertArticle, commentDeletion, fetchUsers};