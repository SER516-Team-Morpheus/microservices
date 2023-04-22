const request = require('supertest')
const { app } = require('./index')
const username = 'taigatestser516'
const password = 'testuser'
const projectId = 722202

describe('POST /cfd', () => {
  test('returns CFD data for the given project name', async () => {
    const response = await request(app)
      .post('/cfd')
      .send({ projectId, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toBeDefined()
  }, 60000)

  test('returns an error if project not found', async () => {
    const projectId = 89898989
    const response = await request(app)
      .post('/cfd')
      .send({ projectId, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
    expect(response.body.error).toEqual('Error getting project details.')
  }, 60000)
})
