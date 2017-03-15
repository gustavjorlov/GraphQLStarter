import {graphql} from 'graphql';
import schema from './schema';


const query = `{
  kitscon(id: "17.1"){
    id,
    date,
    attendees {
      id,
      name,
      talk {
        title
      }
    },
    talks {
      id,
      title,
      talker {
        id,
        name
      }
    }
  }
}`;

const run = query => {
  graphql(schema, query).then(result => {
    console.log(JSON.stringify(result, null, 2));
  });
};

run(query);
