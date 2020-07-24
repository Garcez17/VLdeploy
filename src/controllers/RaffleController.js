const knex = require('../database/connection');
const fs = require('fs');
const path = require('path');
const multerConfig = require('../config/multer');

module.exports = {
  async showinners(req, res) {
    const { id } = req.params;
    const arWin = await knex('raffle').where('id', id).select('winners');

    const winners_array = arWin[0].winners.split(",");

    const winners = await knex('numbers').select('number', 'name_user').whereIn('id', winners_array);

    return res.json(winners);
  },
  async indexhome(req, res) {
    const trx = await knex.transaction();

    const page = await trx('raffle').select('*');
    const Raffle = await trx('raffle').select('*').offset(page.length - 1);
    await trx.commit();

    const newRaffle = Raffle.map(raffle => {
      return {
        ...raffle,
        image_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.image}`,
        imageHome_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.imageHome}`
      }
    })

    return res.json(newRaffle);
  },
  async indexfilter(req, res) {
    const trx = await knex.transaction();

    const page = await trx('raffle').select('*');
    const Raffle = await trx('raffle').select('*').offset(page.length - 5).limit(4);
    await trx.commit();

    const newRaffle = Raffle.map(raffle => {
      return {
        ...raffle,
        image_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.image}`,
        imageHome_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.imageHome}`
      }
    })

    return res.json(newRaffle);
  },
  async index(req, res) {
    const Raffle = await knex('raffle').select('*');

    const newRaffle = Raffle.map(raffle => {
      return {
        ...raffle,
        image_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.image}`,
        imageHome_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.imageHome}`
      }
    })

    return res.json(newRaffle)
  },
  async show(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;

    const raffle = await knex('raffle').where('id', id).first();

    if(!raffle) return res.status(400).json({ message: 'Sorteio não encontrado.' });

    const [count] = await knex('numbers').where('numbers.raffle_id', id).count();

    const [vailble] = await knex('numbers').where('numbers.raffle_id', id)
      .where('status', 'Disponivel').count();

    const [reserved] = await knex('numbers').where('numbers.raffle_id', id)
      .where('status', 'Reservado').count();

    const [paid] = await knex('numbers').where('numbers.raffle_id', id)
    .where('status', 'Pago').count();

    const numbers = await knex('numbers')
      .limit(500)
      .offset((page - 1) * 500)
      .where('numbers.raffle_id', id);

    const serializedRaffle = {
      ...raffle,
      image_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.image}`,
      imageHome_url: `http://valepremier-backend.herokuapp.com/uploads/${raffle.imageHome}`
    }

    const statusIndex = {
      vailble,
      reserved,
      paid,
      count,
    }

    return res.json({raffle: serializedRaffle, statusIndex, numbers});
  },
  async create(req, res) {
    const { name, description, type, promotion, initial_title, value, fieldnumbers } = req.body;
    const files = req.files;

    const trx = await knex.transaction();

    const imageHome = files[1];
    const image = files[0];

    const imageHomeTreaty = imageHome.filename.replace(/[ ]/g, "-");
    const imageTreaty = image.filename.replace(/[ ]/g, "-");

    const raffle = {
      image: imageTreaty,
      imageHome: imageHomeTreaty,
      name,
      type,
      promotion,
      description,
      initial_title,
      value,
      fieldnumbers,
      status: 'Ativo'
    }

    const insertedIds = await trx('raffle').insert(raffle);

    const raffle_id = insertedIds[0];

    for(var number = 0; number < fieldnumbers; number++) {
      await trx('numbers').insert({
        number,
        status: 'Disponivel',
        name_user: '',
        telefone01: '',
        telefone02: '',
        cpf: '',
        raffle_id,
      });
    }

    await trx.commit();
    
    return res.json({
      raffle_id,
      ...raffle,
    });
  },
  async update(req, res) {
    const { id } = req.params;
    const { name, date, initial_title, description, value } = req.body;

    const raffle = {
      name,
      date,
      initial_title,
      description,
      value
    }

    await knex('raffle').where('id', id).update({
      name: name,
      date: date,
      initial_title: initial_title,
      description: description,
      value: value,
    });

    return res.json(raffle);
  },
  async finalize(req, res) {
    const { id } = req.params;
    const { winners } = req.body;

    const numbers = await knex('numbers').select('*').where('raffle_id', id).andWhere('number', winners);

    const winnersId = winners.toString();

    await knex('raffle').where('id', id).update({
      status: 'Encerrado',
      winners: winnersId,
    });

    return res.json(numbers);
  },
  async destroy(req, res) {
    const { id } = req.params;

    const raffle = await knex('raffle').select('*').where('id', id);

    const raffleImage = path.join(multerConfig.directory, raffle[0].image);
    const raffleImageHome = path.join(multerConfig.directory, raffle[0].imageHome);
    
    await fs.promises.unlink(raffleImage);
    await fs.promises.unlink(raffleImageHome);

    await knex('numbers').select('*').where('raffle_id', id).delete();
    await knex('orders').select('*').where('raffle_id', id).delete();
    await knex('raffle').select('*').where('id', id).delete();

    return res.json({ message: 'Sorteio deletado' });
  },
}
