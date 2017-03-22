import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull} from 'graphql';
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
    id: { type: GraphQLString, description: 'Semver FTW' },
    date: { type: GraphQLString, description: 'Date of the dates' },
    talks: {
      description: 'List of all talks on the conference',
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

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Add stuff to the conference',
  fields: {
    addAttendee: {
      type: Person,
      description: 'Create Person to add to the conference',
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve: (source, args) => database.addAttendee(args.name)
    }
  }
});

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});

export default schema;
