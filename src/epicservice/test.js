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

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .post('/listEpics')
        .set('Accept', 'application/json')
        .send({
          username: 'invaliduser',
          password: 'invalidpassword',
          projectId: 733810
        })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
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

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .post('/getEpic/')
        .set('Accept', 'application/json')
        .query({
          username: 'invaliduser',
          password: 'invalidpassword',
          epicId: 187877
        })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('POST /editEpic/', () => {
    it('should edit the epic and return 200 status code', async () => {
      const response = await request(app)
        .post('/editEpic')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          epicId: 187877,
          name: 'Updated Epic 1',
          version: '1'
        })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epic).toBeDefined()
    })

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .post('/editEpic')
        .send({
          username: 'invaliduser',
          password: 'invalidpassword',
          epiId: 187877,
          name: 'Updated Epic 1',
          version: '1'
        })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })
})
