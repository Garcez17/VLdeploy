const knex = require('../database/connection');
const bcrypt = require('bcryptjs');
const { sign } = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = {
  async create(req, res) {
    const { name, login, password } = req.body;
    
    const Users = await knex('admin_user').select('login');

    Users.map(user => {
      if(user.login === login) {
        return res.status(400).send({ error: 'User already exist' });
      }
    });
    
    if(!name || !login || !password) {
      return res.status(400).send({ error: 'Registration Failed' });
    };

    const hash = await bcrypt.hash(password, 10);

    const user = {
      name,
      login,
      password: hash
    };

    await knex('admin_user').insert(user);

    user.password = undefined;

    return res.json(user);
  },

  async authenticate(req, res) {
    const { login, password } = req.body;

    const user = await knex('admin_user').where('login', login).first();

    if(!user) return res.status(400).send({ error: 'Incorrect email/password combination' });

    if(!await bcrypt.compare(password, user.password)) 
      return res.status(400).send({ error: 'Incorrect email/password combination' });

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id.toString(),
      expiresIn,
    });

    user.password = undefined;

    return res.json({ user, token});
  }
}