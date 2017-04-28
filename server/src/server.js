import express from 'express';
import {graphql} from 'graphql';
import {createSchema} from './schema';
import bodyParser from 'body-parser';
import {connectDB} from './database/mysql_connector';
import {WorkService} from './database/work_service';

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(bodyParser.json());
app.use(express.static('../frontend/build'));

connectDB({
  database: 'users', userName: 'admin', password: 'hejhoj',
  host: 'mysql-service', dialect: 'mysql', logging: false // console.log // false
}).then(db => {
  console.log("Woop, db done", Object.keys(db));
  const _workService = WorkService(db);
  const schema = createSchema(_workService);
  const run = (query, variables, operationName) => graphql(schema, query, variables, operationName);

  app.post('/graphql', async (req, res) => {
    const {query, operationName, variables} = req.body;
    const response = await run(query, variables, operationName);
    res.send(response);
  });

  app.listen(4000, () => {
    console.log('Listening');
  });

}).catch(err => {
  console.log("Nope", err);
  throw err;
});
