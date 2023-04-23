const request = require('supertest')
const { app } = require('./index')
const username = 'taigatestser516'
const password = 'testuser'
const sprintID = 345482

describe('POST /sb', () => {
  test('returns Sprint BurnDown Chart data for the given Sprint ID', async () => {
    const response = await request(app)
      .post('/sb')
      .send({ sprintID, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    expect(response.body).toBeDefined()
  }, 60000)

  test('returns an error if Sprint not found', async () => {
    const sprintID = 89898989
    const response = await request(app)
      .post('/sb')
      .send({ sprintID, username, password })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(500)
    expect(response.body.error).toEqual('Error getting Sprint Stats details.')
  }, 60000)
})
