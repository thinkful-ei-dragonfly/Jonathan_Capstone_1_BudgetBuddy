const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserwithEmail(knex, email){
  return knex
  .select('*')
  .from('users')
  .where('email', email)
  .first()
},
comparePasswords(user_password, hash){
  return bcrypt.compare(user_password, hash)
},

createJwt(subject, payload){
  return jwt.sign(payload, config.JWT_SECRET, {
    subject,
    algorithm: 'HS256'
  })
}, 

parseBasicToken(token){
  return Buffer
  .from(token, 'base64')
  .toString()
  .split(':')
},
}
module.exports = AuthService