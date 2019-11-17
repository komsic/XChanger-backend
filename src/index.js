import express from 'express';
import cors from 'cors';
import morganBody from 'morgan-body';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import Joi from '@hapi/joi';
import dotenv from 'dotenv';

import getRates from './util';
import currency from '../currency.json';

const app = express();
morganBody(app, { prettify: true });

app.use(cors());
app.use(bodyParser.json());

dotenv.config();

const validator = (req, res, next) => {
  const { base_currency: baseCurrency, currencies: currs } = req.query;
  const currencies = currs.split(',');

  const stringSchema = Joi.string().trim().min(3).max(3)
    .valid(...Object.keys(currency))
    .uppercase();
  const schema = Joi.object({
    baseCurrency: stringSchema.required(),
    currencies: Joi.array().items(stringSchema).unique().required(),
  });

  const { error, value } = schema.validate({ baseCurrency, currencies }, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: true,
  });
  if (error) {
    return res.status(400).json({
      status: 'bad input error',
      error: error.details.map((e) => e.message),
    });
  }

  req.query = value;
  return next();
};

app.get('/', (req, res) => res.status(200).send('Welcome to XChanger Backend Service'));

app.get('/rates', validator, (req, res) => {
  const { baseCurrency, currencies } = req.query;
  const currs = currencies.join(',');

  fetch(`http://apilayer.net/api/live?access_key=${process.env.ACCESS_KEY}&currencies=${baseCurrency},${currs}&format=1`)
    .then((result) => result.json())
    .then((processedResult) => {
      const { quotes, success, error } = processedResult;
      if (success) {
        return res.status(200).json({
          status: 'success',
          rates: getRates(baseCurrency, currencies, quotes),
        });
      }

      throw new Error(error.info);
    })
    .catch((error) => {
      console.log(error.message);
      res.status(500).json({
        status: 'error',
        error: 'Internal Server Error',
      });
    });
});

app.use('*', (_req, res) => {
  res.status(404).send('404 Page Not Found.');
});

const PORT = process.env.PORT || 9001;
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
