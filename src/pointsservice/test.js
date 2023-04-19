const request = require('supertest')
const app = require('./index')

describe('Points Microservice', () => {
  describe('GET /getPoints', () => {
    it('should return a 200 response', async () => {
      const response = await request(app).get('/getPoints').query({
        username: 'SERtestuser',
        password: 'testuser',
        projectName: 'testProject'
      })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toBeDefined()
    })
    it('should return a 404 response', async () => {
      const response = await request(app)
        .get('/getPoints')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProjec'
        })
      expect(response.status).toBe(404)
    })
  })

  describe('POST /createPoints', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post('/createPoints')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject',
          value: Math.floor(Math.random() * 1000)
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.pointsId).toBeDefined()
    })
    it('should return a 409 response', async () => {
      const response = await request(app)
        .post('/createPoints')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject',
          value: 1
        })
      expect(response.status).toBe(409)
      expect(response.body.success).toBe(false)
    })
  })
})
