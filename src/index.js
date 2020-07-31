require('dotenv/config');

const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors())
app.use(express.json());
app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(process.env.PORT || 3333);