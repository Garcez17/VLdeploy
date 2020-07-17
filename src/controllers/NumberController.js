const knex = require('../database/connection');

module.exports = {
  async index(req, res) {
    const { raffle_id } = req.params;
    const numbers = await knex.select('*').from('numbers').where('raffle_id', raffle_id);
  
    return res.json(numbers)
  },
  async show(req, res) {
    const { raffle_id, number_id } = req.params;
    const raffle = await knex.select('id', 'number', 'name_user').from('numbers').where('raffle_id', raffle_id).andWhere('number', number_id);
    const ticket = raffle[0]
    return res.json(ticket);
  },
}