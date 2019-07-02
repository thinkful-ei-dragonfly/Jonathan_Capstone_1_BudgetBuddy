const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
  id: user.id,
  first_name: xss(user.first_name),
  last_name: xss(user.last_name),
  email: xss(user.email),
  user_password: user.user_password,

})

usersRouter
.route('/')
.get((req, res, next) => {
  const knexInstance = req.app.get('db')
  UsersService.getAllUsers(knexInstance)
  .then(users => {
    res.json(users.map(serializeUser))
  })
  .catch(next)
})
.post(jsonParser, (req, res, next) => {
  const { first_name, last_name, email, user_password } = req.body
    const newUser = { first_name, last_name, email, user_password }

    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    newUser.first_name = first_name
    newUser.last_name = last_name
    newUser.email = email
    newUser.user_password = user_password


    UsersService.insertUser(
      req.app.get('db'),
      newUser
    )
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user.id}`))
          .json(serializeUser(user))
      })
      .catch(next)
  })