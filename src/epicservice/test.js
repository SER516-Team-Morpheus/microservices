const request = require('supertest')
const app = require('./index')

describe('Epic Microservice', () => {
  describe('POST /createEpic', () => {
    it('should create a new Epic and return a 201 response', async () => {
      const response = await request(app)
        .post('/createEpic')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectId: 733810,
          name: 'testepic',
          description: 'This is a test Epic.'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.epicId).toBeDefined()
      expect(response.body.epicName).toBeDefined()
      expect(response.body.description).toBeDefined()
    })

    it('should return a 500 response if user is not authenticated', async () => {
      const response = await request(app)
        .post('/createEpic')
        .set('Accept', 'application/json')
        .send({
          username: 'nonexistentuser',
          password: 'invalidpassword',
          projectId: 733810,
          name: 'newtestEpic',
          description: 'This is a test Epic.'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })

    it('should return a 500 response if request body is invalid', async () => {
      const response = await request(app)
        .post('/createEpic')
        .set('Accept', 'application/json')
        .send({
          name: 'newtestEpic',
          description: 'This is a test Epic.'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })
})
