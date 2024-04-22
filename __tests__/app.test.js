const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(data));

afterAll(() => db.end());


describe("/api/topics", () => {
  test("GET 200 - Responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test('GET 404: user enters invalid endpoint', () => {
    return request(app)
      .get("/api/invalidURL")
      .expect(404)
      .then(({ body }) => {
        const { message } = body
        expect(message).toBe('Not found')
      })
  })
})
describe('/api', () => {
  test('GET 200: Returns all available endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints)
      })
  })
})
describe('/api/articles/:article_id', () => {
  test('GET 200: responds with article that corresponds the article_id', () => {
    return request(app)
      .get('/api/articles/4')
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject(expect.objectContaining(
          {
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            article_img_url:
              expect.any(String),
          }
        )
        )
      })
  })
  describe('/api/articles', () => {
    test('GET 200: responds with an array of article objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          const { articles } = body
          expect(articles.length).toBe(13)
          articles.forEach((article) => {
            expect(article).toMatchObject(expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number)
            }))
          })
        })
    })
    test('GET 200: responds with the array in descending order', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles).toBeSortedBy('created_at', { descending: true })
      })

    })
  })
})
describe('GET /api/articles/:article_id/comments', () => {
  test('GET 200: responds with an array with comments for the given id', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body.comments
        expect(comments.length).toBe(11)
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1
          })
          })
        })
      })
  })
  test('GET200: responds with newest comments first', () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body.comments
        expect(comments).toBeSortedBy('created_at', { descending: true })
      })
})
test('POST 201: responds with given comment where the author is the username', () => {
  const newComment = {
      username: "icellusedkars",
      body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
  }
  return request(app)
  .post('/api/articles/3/comments')
  .send(newComment)
  .expect(201)
  .then(({ body }) => {
      const { comment } = body
      expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 3,
          body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works."
  })
  })
})
test("PATCH 200: responds with updated article and amended vote count", () => {
  return request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 1 })
    .expect(200)
    .then(({ body }) => {
      const { article } = body
      expect(article).toMatchObject({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      });
    });
});
describe('/api/comments/:comment_id', () => {
  test('DELETE 204: deletes comment matching given comment_id', () => {
      return request(app)
      .delete('/api/comments/1')
      .expect(204)
  })
  test('DELETE 400: responds with 400 error if given comment_id is invalid', () => {
    return request(app)
    .delete(`/api/comments/aasdasf`)
    .expect(400)
    .then(({ body }) => {
        const { message } = body
        expect(message).toBe('Not found')
    })
})
})