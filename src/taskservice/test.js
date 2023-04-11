const request = require('supertest')
const app = require('./index')

describe('Task Microservices', () => {
  describe('POST /createTask', () => {
    it('should return a 201 response with the taskid and message', async () => {
      const response = await request(app)
        .post('/createTask')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test US3',
          taskname: 'TASK1-TESTCASE'
        })
      expect(response.status).toBe(201)
      expect(response.body.taskId).toBeDefined()
    })
    it('should return a 500 response with an error message if task is not created', async () => {
      const response = await request(app)
        .post('/createTask')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProjectFail',
          userstoryname: 'test US',
          taskname: 'TASK1-TESTCASE'
        })
      expect(response.status).toBe(500)
    })
  })
  describe('POST /updateTask', () => {
    it('should return a 201 response with the taskid and updation message', async () => {
      const response = await request(app)
        .post('/updateTask')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test US3',
          taskname: 'TASK1-TESTCASE',
          description: 'Testing personal data',
          status: 'Ready for Test'
        })
      expect(response.status).toBe(201)
      expect(response.body.taskId).toBeDefined()
    })
    it('should return a 500 response with an error message if task is not updated', async () => {
      const response = await request(app)
        .post('/updateTask')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          userstoryname: 'test US3',
          taskname: 'TASK1-Customer',
          description: 'Testing personal data',
          status: 'In Progress'
        })
      expect(response.status).toBe(500)
    })
  })
  describe('DELETE /deleteTask', () => {
    it('should return a 201 response with the taskid and deletion message', async () => {
      const response = await request(app)
        .post('/updateTask')
        .set('Accept', 'application/json')
        .send({
          username: 'SERtestuser',
          password: 'testuser',
          projectname: 'testProject',
          taskname: 'TASK1-TESTCASE'
        })
      expect(response.status).toBe(201)
      expect(response.body.taskId).toBeDefined()
    })
    it('should return a 500 response with an error message if task is not deleted', async () => {
      const response = await request(app)
        .post('/updateTask')
        .set('Accept', 'application/json')
        .send(
          {
            username: 'SERtestuser',
            password: 'testuser',
            projectname: 'testProject',
            taskname: 'TASK1-FAIL'
          }
        )
      expect(response.status).toBe(500)
    })
  })
})
