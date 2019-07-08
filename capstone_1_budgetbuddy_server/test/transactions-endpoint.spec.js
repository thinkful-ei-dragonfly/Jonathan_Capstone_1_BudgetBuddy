const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeMaliciousUser } = require('./users.fixtures')
const { makeCategoriesArray, makeMaliciousCategory } = require('./category.fixtures')
const { makeTransactionsArray, makeMaliciousTransaction } = require('./transactions.fixtures')

describe('Transactions Endpoints', () => {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('clean the table', () => db.raw('TRUNCATE users, category, transactions RESTART IDENTITY CASCADE'))

  afterEach('cleanup', () => db.raw('TRUNCATE users, category, transactions RESTART IDENTITY CASCADE'))

  describe(`GET /api/transactions`, () => {
    context(`Given no transactions`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
        .get('/api/transactions')
        .expect(200, [])
      })
    })

    context(`Given there are transactions in the database`, () => {
      const testTransactions = makeTransactionsArray()
      const testUsers = makeUsersArray()
      const testCategories = makeCategoriesArray()

      beforeEach('insert transactions', () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
          .into('category')
          .insert(testCategories)
          .then(() => {
            return db
            .into('transactions')
            .insert(testTransactions)
          })
        })
      })

      it('responds with 200 and all of the transactions', () => {
        return supertest(app)
        .get('/api/transactions')
        .expect(200, testTransactions)
      })
    })

    context(`Given an XSS attack transaction`, () => {
      const { maliciousTransaction, expectedTransaction } = makeMaliciousTransaction()
      const testUsers = makeUsersArray()
      const testCategories = makeCategoriesArray()

      beforeEach('insert malicious transaction', () => {
        return db 
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
          .into('category')
          .insert(testCategories)
          .then(() => {
            return db
            .into('transactions')
            .insert(maliciousTransaction)
          })
        })
      })

      it(`removes XSS attack content`, () => {
        supertest(app)
        .get(`/api/transactions`)
        .expect(200)
        .expect(res => {
          expect(res.body[0].title).to.eql(expectedTransaction.title)
        })
      })
    })
  })



  describe(`GET /api/transactions/:transaction_id`, () => {

    context(`Given no transactions`, () => {
      it(`responds with 404`, () => {
        const transactionId = 123456
        return supertest(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(404, {
          error: {
            message: `Transaction doesn't exist`
          }
        })
      })
    })

    context('Given there are transactions in the database', () => {
      const testUsers = makeUsersArray()
      const testCategories = makeCategoriesArray()
      const testTransactions = makeTransactionsArray()

      beforeEach('insert transactions', () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
          .into('category')
          .insert(testCategories)
          .then(() => {
            return db
            .into('transactions')
            .insert(testTransactions)
          })
        })
      })

      it('responds with 200 and the specified transaction', () => {
        const transactionId = 2
        const expectedTransaction = testTransactions[transactionId - 1]
        return supertest(app)
        .get(`/api/transactions/${transactionId}`)
        .expect(200, expectedTransaction)
      })
    })

    context(`Given an XSS attack Transaction`, () => {
      const testUsers = makeUsersArray()
      const testCategories = makeCategoriesArray()
      const maliciousTransaction = {
        id : 911,
        date_added: '2019-07-03T19:26:38.918Z',
        title: `Some food <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">`,
        amount: 10.00,
        user_id: 1,
        category: 2
      }

      beforeEach('insert malicious transaction', () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
          .into('category')
          .insert(testCategories)
          .then(() => {
            return db
            .into('transactions')
            .insert(maliciousTransaction)
          })
        })
      })

      it('removes XSS attack content', () => {
        return supertest(app)
        .get(`/api/transactions/${maliciousTransaction.id}`)
        .expect(200)
        .expect(res => {
          expect(res.body.title).to.eql(`Some food <img src="https://url.to.file.which/does-not.exist">`)
          })
        })
      })
    })



    describe(`POST /api/transactions`, () => {
      const testUsers = makeUsersArray()
      const testCategories = makeCategoriesArray()

      beforeEach('insert users and categories', () => {
        return db
        .into('users')
        .insert(testUsers)
        .then(() => {
          return db
          .into('category')
          .insert(testCategories)
        })
      })

      it(`creates a transaction, responding with 201 and the new transaction`, () => {
        const newTransaction = {
          title: 'New Transaction',
          amount: 5.00,
          user_id: 1,
          category: 1
        }
        return supertest(app)
        .post('/api/transactions')
        .send(newTransaction)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newTransaction.title)
          expect(res.body.amount).to.eql(newTransaction.amount)
          expect(res.body.user_id).to.eql(newTransaction.user_id)
          expect(res.body.category).to.eql(newTransaction.category)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/transactions/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
          .get(`/api/transactions/${postRes.body.id}`)
          .expect(postRes.body)
          )
      })

      const requiredFields = ['title', 'amount', 'user_id', 'category']

      requiredFields.forEach(field => {
        const newTransaction = {
          title: 'New transaction',
          amount: 5.00,
          user_id: 1,
          category: 1
        }

        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newTransaction[field]

          return supertest(app)
          .post('/api/transactions')
          .send(newTransaction)
          .expect(400, {
            error: {
              message: `Missing '${field}' in request body`
            }
          })
        })
      })
      
      it('removes XSS attack content', () => {
        const { maliciousTransaction, expectedTransaction } = makeMaliciousTransaction()
        return supertest(app)
        .post(`/api/transactions`)
        .send(maliciousTransaction)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(expectedTransaction.title)
        })
      })
    })



    describe(`DELETE /api/transactions/:transaction_id`, () => {
      context('Given no transactions', () => {
        it(`responds with 404`, () => {
          const transactionId = 123456
          return supertest(app)
          .delete(`/api/transactions/${transactionId}`)
          .expect(404, {
            error: {
              message: `Transaction doesn't exist`
            }
          })
        })
      })

      context('Given there are transactions in the database', () => {
        const testUsers = makeUsersArray()
        const testCategories = makeCategoriesArray()
        const testTransactions = makeTransactionsArray()

        beforeEach('insert transactions', () => {
          return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
            .into('category')
            .insert(testCategories)
            .then(() => {
              return db
              .into('transactions')
              .insert(testTransactions)
            })
          })
        })

        it('responds with 204 and removes the transaction', () => {
          const idToRemove = 2
          const expectedTransactions = testTransactions.filter(transaction => transaction.id !== idToRemove)
          return supertest(app)
          .delete(`/api/transactions/${idToRemove}`)
          .expect(204)
          .then(res => 
            supertest(app)
            .get(`/api/transactions`)
            .expect(expectedTransactions))
        })
      })
    })



    describe(`PATCH /api/transactions/:transaction_id`, () => {
      context('Given no transactions', () => {
        it(`responds with 404`, () => {
          const transactionId = 123456
          return supertest(app)
          .patch(`/api/transactions/${transactionId}`)
          .expect(404, {
            error: {
              message: `Transaction doesn't exist`
            }
          })
        })
      })

      context('Given there are transactions in the database', () => {
        const testUsers = makeUsersArray()
        const testCategories = makeCategoriesArray()
        const testTransactions = makeTransactionsArray()

        beforeEach('insert transactions', () => {
          return db
          .into('users')
          .insert(testUsers)
          .then(() => {
            return db
            .into('category')
            .insert(testCategories)
            .then(() => {
              return db
              .into('transactions')
              .insert(testTransactions)
            })
          })
        })

        it('responds with 204 and updates the transaction', () => {
          const idToUpdate = 2
          const updateTransaction = {
            title: 'New Transaction',
            amount: 5.00,
            user_id: 1,
            category: 1
          }
          const expectedTransaction = {
            ...testTransactions[idToUpdate - 1],
            ...updateTransaction
          }
          return supertest(app)
          .patch(`/api/transactions/${idToUpdate}`)
          .send(updateTransaction)
          .expect(204)
          .then(res => 
            supertest(app)
            .get(`/api/transactions/${idToUpdate}`)
            .expect(expectedTransaction))
        })

        it(`responds with 400 when no required fields supplied`, () => {
          const idToUpdate = 2
          return supertest(app)
          .patch(`/api/transactions/${idToUpdate}`)
          .send({ irrelevantField: 'foo'})
          .expect(400, {
            error: {
              message: `Request body must contain either 'title', 'amount', 'user_id', 'category'`
            }
          })
        })

        it(`responds with 204 when updating only a subset of fields`, () => {
          const idToUpdate = 2
          const updateTransaction = {
            amount: 25.00,
          }
          const expectedTransaction = {
            ...testTransactions[idToUpdate - 1],
            ...updateTransaction
          }

          return supertest(app)
          .patch(`/api/transactions/${idToUpdate}`)
          .send({
            ...updateTransaction,
            fieldToIgnore: 'should not be in the GET response'
          })
          .expect(204)
          .then(res => 
            supertest(app)
            .get(`/api/transactions/${idToUpdate}`)
            .expect(expectedTransaction))
        })
      })
    })
  })
