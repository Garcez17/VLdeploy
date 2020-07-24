const knex = require('../database/connection');

module.exports = {
  async index(req, res) {
    const { raffle_id } = req.params;
    
    const Orders = await knex('orders')
      .select('*')
      .where('raffle_id', raffle_id);

    return res.json(Orders);
  },
  async searchId(req, res) {
    const { raffle_id, search } = req.params;
    
    const Orders = await knex('orders')
      .select('*')
      .where('raffle_id', raffle_id).andWhere('id', search);

    return res.json(Orders);
  },
  async searchName(req, res) {
    const { raffle_id } = req.params;
    const { search } = req.query;
    
    const Orders = await knex('orders')
      .select('*')
      .where('raffle_id', raffle_id).andWhere('name_user', search);

    return res.json(Orders);
  },
  async show(req, res) {
    const { raffle_id, cpf } = req.params;
    
    const Orders = await knex('orders')
      .select('*')
      .where('raffle_id', raffle_id).andWhere('cpf', cpf);

    return res.json(Orders);
  },
  async create(req, res) {
    const { raffle_id } = req.params;
    const { name_user, telefone01, telefone02, cpf, value, number, affiliate } = req.body;

    const trx = await knex.transaction();

    const numbers = await trx('numbers')
      .where('numbers.raffle_id', raffle_id)
      .andWhere('numbers.id', 'in', number);

    let AffiliateId
    if(affiliate !== '0') {
      let AffiliateIdArray = await trx('affiliates').select('id').where('name', affiliate);
      AffiliateId = AffiliateIdArray[0].id;
    } else {
      AffiliateId = null
    }

    const numbers_ids = numbers.map(number => number.id);
    const numbersTratatos = numbers.map(number => number.number);

    const StringNumber = numbersTratatos.toString().replace(/[","]/g, ", ");
    const StringNumbersId = numbers_ids.toString().replace(/[","]/g, ", ");
    
    const order = {
      name_user,
      status: 'Reservado',
      telefone01,
      telefone02,
      cpf,
      number: StringNumber,
      value,
      numbers_id: StringNumbersId,
      affiliate_id: AffiliateId,
      affiliate_name: affiliate,
      raffle_id
    }

    await trx('orders').insert(order);

    const orders = await trx('orders').where('affiliate_id', AffiliateId);

    await trx('affiliates').where('id', AffiliateId).update({
      sales: orders.length,
    });

    await trx('numbers')
      .where('numbers.raffle_id', raffle_id)
      .andWhere('numbers.id', 'in', number)
      .update({
        name_user,
        status: 'Reservado',
        telefone01, 
        telefone02, 
        cpf
      });

    await trx.commit();

    return res.json(order);
  },
  async update(req, res) {
    const { raffle_id, order_id } = req.params;

    const trx = await knex.transaction();

    const order = await trx('orders').where('raffle_id', raffle_id).andWhere('id', order_id);
    
    const arr = order[0].numbers_id;
    let newArr

    if(typeof arr === 'number') {
      newArr = order[0].numbers_id;
      await trx('numbers').where('id', newArr).update({
        status: 'Pago',
      });
      await trx('orders').where('raffle_id', raffle_id).andWhere('id', order_id).update({
        status: 'Pago',
      });
    } else {
      const arr1 = order[0].numbers_id.split(',')
      newArr = arr1.map(res => {
        return parseInt(res);
      });
      await trx('numbers').whereIn('id', newArr).update({
        status: 'Pago',
      });
      await trx('orders').where('raffle_id', raffle_id).andWhere('id', order_id).update({
        status: 'Pago',
      });
    }

    await trx.commit();

    return res.json(order);
  },
  async destroy(req, res) {
    const { raffle_id, order_id } = req.params;

    const trx = await knex.transaction();

    const order = await trx('orders').where('raffle_id', raffle_id).andWhere('id', order_id);

    const typeIdAffiliate = order[0].affiliate_id;

    if(typeIdAffiliate !== null) {
      const affiliate = await trx('affiliates').where('id', order[0].affiliate_id);

      await trx('affiliates').where('id', order[0].affiliate_id).update({
        sales: affiliate[0].sales -1,
      });
    }
   
    const arr = order[0].numbers_id;
    let newArr

    if(typeof arr === 'number') {
      newArr = order[0].numbers_id;
      await trx('numbers').where('id', newArr).update({
        status: 'Disponivel',
        name_user: '',
        telefone01: '',
        telefone02: '',
        cpf: '',
      });
    } else {
      const arr1 = order[0].numbers_id.split(',')
      newArr = arr1.map(res => {
        return parseInt(res);
      });
      await trx('numbers').whereIn('id', newArr).update({
        status: 'Disponivel',
        name_user: '',
        telefone01: '',
        telefone02: '',
        cpf: '',
      });
    }

    await trx('orders').where('raffle_id', raffle_id).andWhere('id', order_id).delete();

    await trx.commit();

    return res.json({ message: 'Order deleted' });
  }
}