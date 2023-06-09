const request = require('supertest')
const app = require('./index')

describe('Member Microservice', () => {
  let memberCreated
  describe('POST /createMember', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .post('/createMember')
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01',
          member: 'uniqueASU',
          projectId: 720797
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.memberId).toBeDefined()
      memberCreated = response.body.memberId
    })
    it('should return a 500 response', async () => {
      const response = await request(app)
        .post('/createMember')
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01',
          member: 'uniqueASU',
          projectId: 9
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('GET /getMembers', () => {
    it('should return a 201 response ', async () => {
      const response = await request(app)
        .get('/getMembers')
        .set('Accept', 'application/json')
        .query({
          username: 'SERtestuser',
          password: 'testuser',
          projectId: 720797
        })
      expect(response.status).toBe(201)
      expect(response.body.data).toBeDefined()
    })
    it('should return a 500 response ', async () => {
      const response = await request(app)
        .get('/getMembers')
        .set('Accept', 'application/json')
        .query({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01',
          projectId: 720
        })
      expect(response.status).toBe(500)
    })
  })

  describe('DELETE /deleteMember/:id', () => {
    it('should return a 201 response', async () => {
      const response = await request(app)
        .delete(`/deleteMember/${memberCreated}`)
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01'
        })
      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
    })
    it('should return a 500 response', async () => {
      const response = await request(app)
        .delete('/deleteMember/xyz')
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01'
        })
      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.message).toBeDefined()
    })
  })

  describe('PATCH /editMemberRole', () => {
    it('should return a 201 response ', async () => {
      const response = await request(app)
        .patch('/editMemberRole')
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01',
          roleId: 4371742,
          memberId: 1446686
        })
      expect(response.status).toBe(201)
      expect(response.body.data).toBeDefined()
    })
    it('should return a 500 response ', async () => {
      const response = await request(app)
        .patch('/editMemberRole')
        .set('Accept', 'application/json')
        .send({
          username: 'sambhavv14asu',
          password: 'Wisdommarrt_01',
          roleId: 4371742,
          memberId: 144
        })
      expect(response.status).toBe(500)
    })
  })
})
