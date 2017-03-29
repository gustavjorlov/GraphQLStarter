import {GraphQLSchema, GraphQLList, GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} from 'graphql';
import {database} from './database';
var DataLoader = require('dataloader');

const personLoader = new DataLoader(keys => database.getPersonsByIds(keys));
const loadPersonByTalk = new DataLoader(talkIds => new Promise((resolve, reject) => {
    resolve(database.getPersonsByTalkIds(talkIds));
}));

const Person = new GraphQLObjectType({
  name: 'Person',
  description: 'Consultants, nerds and others',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    talk: {
      type: Talk,
      resolve: (source, args) => database.getTalkByPersonId(source.id)
    }
  })
});

const Talk = new GraphQLObjectType({
  name: 'Talk',
  fields: {
    id: { type: GraphQLString },
    talker: {
      type: Person,
      resolve: (talk, args) => loadPersonByTalk.load(talk.id)
    },
    title: {type: GraphQLString},
    transcript: {type: GraphQLString},
    attendees: {
      type: new GraphQLList(Person),
      resolve: talk => talk.attendees.map(attendee => personLoader.load(attendee))
    }
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
      resolve: () => database.getTalks()
    },
    attendees: {
      type: new GraphQLList(Person),
      resolve: (source, args) => database.getPersons()
    }
  }
});

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: {
    attendees: {
      type: new GraphQLList(Person),
      resolve: (source, args) => {
        return database.getPersons();
      }
    },
    kitscon: {
      type: KitsCon,
      args: {
        id: {type: GraphQLString}
      },
      resolve: (source, args) => database.getConferenceById(args.id)
    },
    talks: {
      type: new GraphQLList(Talk),
      resolve: () => database.getTalks()
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
