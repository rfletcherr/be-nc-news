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
})
})