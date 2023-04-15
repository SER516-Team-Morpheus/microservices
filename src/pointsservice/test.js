const request = require('supertest')
const app = require('./index')

describe('Points Microservice', () => {
  describe('GET /getPoints', () => {
    it('should return a 200 response', async () => {
      const response = await request(app).get('/getPoints').query({
        username: 'SERtestuser',
        password: 'testuser',
        projectName: 'testProject',
      })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
    })
    it('should return a 404 response', async () => {
      const response = await request(app)
        .post('/getPoints')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProjec',
        })
      expect(response.status).toBe(404)
    })
  })
})
