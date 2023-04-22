/* eslint-disable no-undef */
const request = require('supertest')
const app = require('./index')

describe('Issue Microservice', () => {
  let issueCreated
  describe('POST /createIssue', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post('/createIssue')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject',
          subject: "testIssueNew",
          assigned_to: null,
          description: 'Implement API CALLs',
          is_closed: false,
          priority: 'Normal',
          severity: 'Critical',
          status: 'New',
          type: 'Bug'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.issueId).toBeDefined()
      issueCreated = response.body.issueId
    }, 10000)
    it('should return a 500 response', async () => {
      const response = await request(app)
        .post('/createIssue')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestused',
          password: 'testuser',
          projectName: 'Nonexisiting',
          subject: 'a',
          assigned_to: null,
          description: 'Implement API CALLs',
          is_closed: false,
          priority: 'Normal',
          severity: 'Critical',
          status: 'New',
          type: 'Bug'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('GET /getIssues', () => {
    it('should return a 201 response ', async () => {
      const response = await request(app)
        .get('/getIssues')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectName: 'testProject'
        })
      expect(response.status).toBe(201)
      expect(response.body.data).toBeDefined()
    })
    it('should return a 500 response ', async () => {
      const response = await request(app)
        .get('/getIssues')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuserxyaa',
          password: 'testuser',
          projectName: 'blabber'
        })
      expect(response.status).toBe(500)
    })
  })

  describe('DELETE /deleteIssue/:id', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .delete(`/deleteIssue/${issueCreated}`)
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
    })
    it('should return a 500 response', async () => {
      const response = await request(app)
        .delete('/deleteIssue/xyz')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('PATCH /updateIssue', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .patch('/updateIssue')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          issuename: 'ABC',
          status: 'Postponed',
          priority: 'High',
          severity: 'Low',
          type: 'Enhancement'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
    })
    it('should return a 500 response', async () => {
      const response = await request(app)
        .patch('/updateIssue')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          issuename: 'ABCDEF',
          status: 'Postponed',
          priority: 'High',
          severity: 'Low',
          type: 'Enhancement'
        })
      expect(response.status).toBe(500)
    })
  })
})
