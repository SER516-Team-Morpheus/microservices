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
  })

  describe('POST /listEpics', () => {
    it('should return a list of epics and return 200 status code', async () => {
      const response = await request(app)
        .post('/listEpics')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectId: 733810
        })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epics).toBeDefined()
    })
  })

  describe('POST /getEpic', () => {
    it('should return epic details and return 200 status code', async () => {
      const response = await request(app)
        .post('/getEpic/')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          epicId: 187877
        })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epic).toBeDefined()
    })
  })
})
