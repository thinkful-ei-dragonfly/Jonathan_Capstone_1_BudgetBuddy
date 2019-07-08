const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeMaliciousUser } = require('./users.fixtures')

describe('Users Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

  describe(`GET /api/users`, () => {

    context(`Given no users`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, [])
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 200 and all of the users', () => {
        return supertest(app)
          .get('/api/users')
          .expect(200, testUsers)
      })
    })

    context(`Given an XSS attack user`, () => {
      const { maliciousUser, expectedUser } = makeMaliciousUser()

      beforeEach('insert malicious user', () => {
        return db
          .into('users')
          .insert(maliciousUser)
      })

      it(`removes XSS attack content`, () => {
        return supertest(app)
          .get(`/api/users`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].first_name).to.eql(expectedUser.first_name)
            expect(res.body[0].last_name).to.eql(expectedUser.last_name)
            expect(res.body[0].email).to.eql(expectedUser.email)
          })
      })
    })
  })



  describe(`GET /api/users/:user_id`, () => {

    context(`Given no users`, () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(404, {
            error: {
              message: `User doesn't exist`
            }
          })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 200 and the specified user', () => {
        const userId = 2
        const expectedUser = testUsers[userId - 1]
        return supertest(app)
          .get(`/api/users/${userId}`)
          .expect(200, expectedUser)
      })
    })

    context(`Given an XSS attack User`, () => {
      const maliciousUser = {
        id: 911,
        first_name: `Phillip <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
        last_name: `Banks <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
        email: `phillip.banks@gmail.com <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
        user_password: '01010101010'
      }

      beforeEach('insert malicious user', () => {
        return db
          .into('users')
          .insert(maliciousUser)
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/users/${maliciousUser.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.first_name).to.eql(`Phillip <img src="https://url.to.file.which/does-not.exist">`)
            expect(res.body.last_name).to.eql(`Banks <img src="https://url.to.file.which/does-not.exist">`)
            expect(res.body.email).to.eql(`phillip.banks@gmail.com <img src="https://url.to.file.which/does-not.exist">`)
          })
      })
    })
  })



  describe(`POST /api/users`, () => {
    it(`creates a user, responding with 201 and the new user`, () => {
      const newUser = {
        first_name: 'Phillip',
        last_name: 'Banks',
        email: 'phillip.banks@gmail.com',
        user_password: '01010101010'
      }
      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect(res => {
          expect(res.body.first_name).to.eql(newUser.first_name)
          expect(res.body.last_name).to.eql(newUser.last_name)
          expect(res.body.email).to.eql(newUser.email)
          expect(res.body.user_password).to.eql(newUser.user_password)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/users/${postRes.body.id}`)
            .expect(postRes.body)
        )
    })

    const requiredFields = ['first_name', 'last_name', 'email', 'user_password']

    requiredFields.forEach(field => {
      const newUser = {
        first_name: 'First',
        last_name: 'Last',
        email: 'email@email.com',
        user_password: 'password'
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newUser[field]

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(400, {
            error: {
              message: `Missing '${field}' in request body`
            }
          })
      })

      it('removes XSS attack content from response', () => {
        const { maliciousUser, expectedUser } = makeMaliciousUser()
        return supertest(app)
          .post(`/api/users`)
          .send(maliciousUser)
          .expect(201)
          .expect(res => {
            expect(res.body.first_name).to.eql(expectedUser.first_name)
            expect(res.body.last_name).to.eql(expectedUser.last_name)
            expect(res.body.email).to.eql(expectedUser.email)
            expect(res.body.user_password).to.eql(expectedUser.user_password)
          })
      })
    })
  })



  describe(`DELETE /api/users/:user_id`, () => {
    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 204 and removes the user', () => {
        const idToRemove = 2
        const expectedUsers = testUsers.filter(user => user.id !== idToRemove)
        return supertest(app)
          .delete(`/api/users/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/users`)
              .expect(expectedUsers)
          )
      })
    })

    context('Given no users', () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .delete(`/api/users/${userId}`)
          .expect(404, {
            error: {
              message: `User doesn't exist`
            }
          })
      })
    })
  })



  describe(`PATCH /api/users/:user_id`, () => {
    context('Given no users', () => {
      it(`responds with 404`, () => {
        const userId = 123456
        return supertest(app)
          .patch(`/api/users/${userId}`)
          .expect(404, {
            error: {
              message: `User doesn't exist`
            }
          })
      })
    })

    context('Given there are users in the database', () => {
      const testUsers = makeUsersArray()

      beforeEach('insert users', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it('responds with 204 and updates the user', () => {
        const idToUpdate = 2
        const updateUser = {
          first_name: 'Phillip',
          last_name: 'Banks',
          email: 'phillip.banks@gmail.com',
          user_password: '01010101010'
        }
        const expectedUser = {
          ...testUsers[idToUpdate -1],
          ...updateUser
        }
        return supertest(app)
        .patch(`/api/users/${idToUpdate}`)
        .send(updateUser)
        .expect(204)
        .then(res =>
          supertest(app)
          .get(`/api/users/${idToUpdate}`)
          .expect(expectedUser)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
        .patch(`/api/users/${idToUpdate}`)
        .send({ irrelevantField: 'foo' })
        .expect(400, {
          error: {
            message: `Request body must contain either 'first_name', 'last_name', 'email', 'user_password'`
          }
        })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateUser = {
          email: 'update@gmail.com',
        }
        const expectedUser = {
          ...testUsers[idToUpdate - 1],
          ...updateUser
        }

        return supertest(app)
        .patch(`/api/users/${idToUpdate}`)
        .send({
          ...updateUser,
          fieldToIgnore: 'should not be in the GET response'
        })
        .expect(204)
        .then(res => 
          supertest(app)
          .get(`/api/users/${idToUpdate}`)
          .expect(expectedUser))
      })
    })
  })
})