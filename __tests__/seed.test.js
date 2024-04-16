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