const UsersService = {
  getAllUsers(knex) {
    return knex.select('*').from('users')
  },

  insertUser(knex) {
    return knex
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex
      .from('users')
      .select('*')
      .where('id', id)
      .first()
  },

  deleteUser(knex, id) {
    return knex('users')
      .where({ id })
      .delete()
  },

  updateUser(knex, id, newUserFields){
    return knex('users')
    .where({ id })
    .update(newUserFields)
  },
}

module.exports = UsersService