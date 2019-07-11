const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const { requireAuth } = require('../middleware/jwt_auth')

authRouter
.post('/login', jsonBodyParser, (req, res, next) => {
  const { email, user_password } = req.body
  const loginUser = { email, user_password }

  for(const [key, value] of Object.entries(loginUser))
  if(value == null)
  return res.status(400).json({
    error: `Missing '${key}' in request body`
  })

  AuthService.getUserwithEmail(
    req.app.get('db'),
    loginUser.email
  )
  .then(dbUser => {
    if(!dbUser)
    return res.status(400).json({
      error: 'Incorrect email or user_password',
    })
    
    return AuthService.comparePasswords(loginUser.user_password, dbUser.user_password)
    .then(compareMatch => {
      if(!compareMatch){
      return res.status(400).json({
        error: 'Incorrect email or user_password'
      })
    }
      const sub = dbUser.email
      const payload = { user_id: dbUser.id }
      res.send({
        authToken: AuthService.createJwt(sub, payload),
        user_id: dbUser.id
      })
    })
    .catch(next)
  })

})


module.exports = authRouter