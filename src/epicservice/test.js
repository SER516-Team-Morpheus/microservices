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
  describe('GET /listEpics', () => {
    it('should return a list of epics and return 200 status code', async () => {
      const response = await request(app)
        .get('/listEpics')
        .query({ username: 'SERtestuser', password: 'testuser', projectId: 733810 })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epics).toBeDefined()
    })

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .get('/listEpics')
        .query({ username: 'invaliduser', password: 'invalidpassword', projectId: 733810 })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('GET /getEpic/:epicId', () => {
    it('should return epic details and return 200 status code', async () => {
      const response = await request(app)
        .get('/getEpic/1')
        .query({ username: 'SERtestuser', password: 'testuser' })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epic).toBeDefined()
    })

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .get('/getEpic/invalidepicid')
        .query({ username: 'invaliduser', password: 'invalidpassword' })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('PUT /editEpic/:epicId', () => {
    it('should edit the epic and return 200 status code', async () => {
      const response = await request(app)
        .put('/editEpic/1')
        .query({ username: 'SERtestuser', password: 'testuser' })
        .send({ name: 'Updated Epic 1', version: '2' })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.epic).toBeDefined()
    })

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .put('/editEpic/1')
        .query({ username: 'invaliduser', password: 'invalidpassword' })
        .send({ name: 'Updated Epic 1', version: '2' })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('DELETE /deleteEpic/:epicId', () => {
    it('should delete the epic and return 200 status code', async () => {
      const response = await request(app)
        .delete('/deleteEpic/1')
        .query({ username: 'SERtestuser', password: 'testuser' })
      expect(response.status).toEqual(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBeDefined()
    })

    it('should return 500 status code if any error occurred', async () => {
      const response = await request(app)
        .delete('/deleteEpic/1')
        .query({ username: 'invaliduser', password: 'invalidpassword' })
      expect(response.status).toEqual(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })
})
