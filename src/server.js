import express from 'express';
import {graphql} from 'graphql';
import schema from './schema';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/graphql', async (req, res) => {
  const response = await run(req.body.query);
  res.send(response);
});

app.listen(3000, () => {
  console.log('Listening');
});

export const run = query => graphql(schema, query);
