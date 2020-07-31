const knex = require('../database/connection');

module.exports = {
  async index(req, res) {
    const trx = await knex.transaction();
    const affiliates = await trx('affiliates').select('*');

    const orders = await trx('orders').select('*');
    if(orders.length === 0) {
      await trx('affiliates').update({
        sales: orders.length
      });
    }
    await trx.commit();
    
    return res.json(affiliates);
  },
  async show(req, res) {
    const { id } = req.params;

    const trx = await knex.transaction();

    const affiliate = await trx('affiliates').where('id', id);

    const orders = await trx('orders').where('affiliate_id', id);

    await trx('affiliates').where('id', id).update({
      sales: orders.length
    });

    await trx.commit();
    
    const affiliateSales = {
      ...affiliate,
      orders
    }

    return res.json(affiliateSales)
  },
  async create(req, res) {
    const { name, cpf, phone, bank, agency, account, type } = req.body;

    const affiliate = {
      name,
      cpf,
      phone,
      bank,
      agency,
      type,
      account,
      sales: 0,
    };
  
    await knex('affiliates').insert(affiliate);

    return res.json(affiliate);
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, cpf, phone, bank, type, agency, account } = req.body;

    const affiliate = await knex('affiliates').where('id', id).update({
      name,
      cpf,
      phone,
      bank,
      type, 
      agency, 
      account
    });

    return res.json(affiliate);
  },
  async destroy(req, res) {
    const { id } = req.params;

    await knex('affiliates').where('id', id).delete();

    return res.json({ message: 'Afiliado Deletado' });
  },
}
