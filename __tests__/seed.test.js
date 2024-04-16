const app = require('../app')
const db = require('../db/connection')
const request = require('supertest')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(data));

afterAll(() => db.end());


describe("/api/topics", () => {
  test("GET 200 - Responds with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3)
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
