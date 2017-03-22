import express from 'express';
import {graphql} from 'graphql';
import schema from './schema';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.post('/graphql', async (req, res) => {
  const {query, operationName, variables} = req.body;
  console.log({variables});
  const response = await run(query, variables, operationName);
  res.send(response);
});

app.listen(3000, () => {
  console.log('Listening');
});

export const run = (query, variables, operationName) => graphql(schema, query, variables, operationName);
