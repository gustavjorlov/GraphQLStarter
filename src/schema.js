import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString} from 'graphql';
import {database} from './database';

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Consultants, nerds and others',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    talk: {
      type: Talk,
      resolve: (source, args) => {
        return database.getTalkByPersonId(source.id);
      }
    }
  })
});

const Talk = new GraphQLObjectType({
  name: 'Talk',
  fields: {
    id: { type: GraphQLString },
    talker: {
      type: Person,
      resolve: (source, args) => {
        return database.getPersonByTalkId(source.id);
      }
    },
    title: {type: GraphQLString}
  }
});

const KitsCon = new GraphQLObjectType({
  name: 'KitsCon',
  description: 'Conference API, the right way',
  fields: {
    id: { type: GraphQLString },
    date: { type: GraphQLString },
    talks: {
      type: new GraphQLList(Talk),
      resolve: () => {
        return database.getTalks();
      }
    },
    attendees: {
      type: new GraphQLList(Person),
      resolve: (source, args) => {
        return database.getPersons();
      }
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: {
    kitscon: {
      type: KitsCon,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (source, args) => {
        return database.getConferenceById(args.id);
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: Query
});

export default schema;
