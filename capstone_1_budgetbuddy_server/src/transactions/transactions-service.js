const TransactionsService = {
  getAllTransactions(knex){
    return knex
    .select('*')
    .from('transactions')
  },

  insertTransaction(knex, newTransaction){
    return knex
    .insert(newTransaction)
    .into('transactions')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },

  getById(knex, id){
    return knex
    .from('transactions')
    .select('*')
    .where('id', id)
    .first()
  },

  deleteTransaction(knex, id){
    return knex('transactions')
    .where({ id })
    .delete()
  },

  updateTransaction(knex, id, newUserFields){
    return knex('transactions')
    .where({ id })
    .update(newUserFields)
  },
}

module.exports = TransactionsService