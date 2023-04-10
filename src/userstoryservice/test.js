const request = require('supertest')
const app = require('./index')

describe('User story Microservices', () => {
  describe('POST /createUserstory', () => {
    it('should return a 201 response with the user story id', async () => {
      const response = await request(app)
        .post('/createUserstory')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject',
          subject: 'test US',
        })
      expect(response.status).toBe(201)
      expect(response.body.userstoryId).toBeDefined()
    })
    it('should return a 500 response with an error message if user story is not created', async () => {
      const response = await request(app)
        .post('/createUserstory')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'noProject',
          subject: 'test US4',
        })
      expect(response.status).toBe(500)
    })
  })

  describe('GET /getUserStory', () => {
    it('should return a 200 response with the user story id and name', async () => {
      const response = await request(app)
        .get('/getUserStory')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject',
        })
      expect(response.status).toBe(200)
      expect(response.body.userStory).toBeDefined()
    }, 20000)
    it('should return a 500 response with an error message if user story is not created', async () => {
      const response = await request(app)
        .get('/getUserStory')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'noProject',
        })
      expect(response.status).toBe(500)
    })
  })

  describe('GET /getUserStoryDetails', () => {
    it('should return a 200 response with the user story id', async () => {
      const response = await request(app)
        .get('/getUserStoryDetails')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test US3',
        })
      expect(response.status).toBe(200)
      expect(response.body.parameters).toBeDefined()
    })
    it('should return a 500 response with the user story id', async () => {
      const response = await request(app)
        .get('/getUserStoryDetails')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test USTest',
        })
      expect(response.status).toBe(500)
    })
  })

  describe('PATCH /updateUserStory', () => {
    it('should return a 201 response with an error message if user story is not created', async () => {
      const response = await request(app)
        .patch('/updateUserstory')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test US3',
          tags: ['feature'],
          points: {
            UX: '2',
            Back: '8',
            Front: '5',
          },
        })
      expect(response.status).toBe(201)
    })
  })
})
