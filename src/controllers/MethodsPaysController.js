const knex = require('../database/connection');
const fs = require('fs');
const path = require('path');
const multerConfig = require('../config/multer');

module.exports = {
  async index(req, res) {
    const methodsPay = await knex('pays_methods').select('*');

    const newMethodsPay = methodsPay.map(methodpay => {
      return {
        ...methodpay,
        image_url: `http://valepremier-backend.herokuapp.com/uploads/${methodpay.image}`,
      }
    })

    return res.json(newMethodsPay)
  },
  async create(req, res) {
    const { name, type, name_user, agency, account } = req.body;

    //const imageTreaty = file.filename.replace(/[ ]/g, "-");
  
    const PaysMethod = {
      image: req.file.filename,
      name,
      type,
      name_user,
      agency,
      account
    }
  
    await knex('pays_methods').insert(PaysMethod)
    
    return res.json(PaysMethod);
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, type, name_user, agency, account } = req.body;

    const payment = {
      name,
      type,
      name_user,
      agency,
      account,
    }
  
    await knex('pays_methods').where('id', id).update({
      name: name,
      type: type,
      name_user: name_user,
      agency: agency,
      account: account,
    });
    
    return res.json(payment);
  },
  async destroy(req, res) {
    const { id } = req.params;
  
    const payments = await knex('pays_methods').where('id', id);

    const paymentsImage = path.join(multerConfig.directory, payments[0].image);
    
    await fs.promises.unlink(paymentsImage);
    await knex('pays_methods').where('id', id).delete();
    
    return res.json({ message: 'Pagamento deletado' });
  }
}
