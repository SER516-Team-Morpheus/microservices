
const request = require('supertest')
const app = require('./index')

describe('Role Microservice', () => {
  describe('GET /getroles', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .get('/getroles')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject'
        })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.roles).toBeDefined()
    })
    // it('should return a 404 response', async () => {
    //   const response = await request(app)
    //     .get('/getroles')
    //     .set('Accept', 'application/json')
    //     .query({
    //       username: 'SERtestuser',
    //       password: 'tetuser',
    //       name: 'testProject1',
    //     })
    //   expect(response.status).toBe(404)
    //   expect(response.body.success).toBe(false)
    //   expect(response.body.message).toBeDefined()
    // }, 30000)
  })
  describe('POST /createroles', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post('/createroles')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          roleName: 'testDevRole',
          projectName: 'testProject'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.roleName).toBeDefined()
    })
    // it('should return a 404 response', async () => {
    //   const response = await request(app)
    //     .post('/createroles')
    //     .set('Accept', 'application/json')
    //     .send({
    //       username: 'SERtestuser',
    //       password: 'tetuser',
    //       roleName: 'testDevRole',
    //       name: 'testProject'
    //     })
    //   expect(response.status).toBe(404)
    // }, 20000)
  })

  describe('PATCH /updateroles', () => {
    it('should return a 200 response', async () => {
      const response = await request(app)
        .patch('/updateroles')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          roleName: 'testDevRole',
          newRoleName: 'Developer',
          projectName: 'testProject'
        })
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.roleName).toBeDefined()
    })
    it('should return a 404 response', async () => {
      const response = await request(app)
        .patch('/updateroles')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          roleName: 'testDevRole',
          newRoleName: 'Developer',
          projectName: 'testProject'
        })
      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
    })
  })
  
})
