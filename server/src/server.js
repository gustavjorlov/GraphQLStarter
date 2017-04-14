import express from 'express';
import {graphql} from 'graphql';
import schema from './schema';
import bodyParser from 'body-parser';

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());

app.use(express.static('../frontend/build'));

app.post('/graphql', async (req, res) => {
  const {query, operationName, variables} = req.body;
  console.log({query});
  const response = await run(query, variables, operationName);
  res.send(response);
});


// TODO: setup listening to database here...
app.listen(4000, () => {
  console.log('Listening');
});

export const run = (query, variables, operationName) => graphql(schema, query, variables, operationName);
