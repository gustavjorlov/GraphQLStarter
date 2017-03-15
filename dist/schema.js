'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _database = require('./database');

var Person = new _graphql.GraphQLObjectType({
  name: 'Person',
  description: 'Consultants, nerds and others',
  fields: function fields() {
    return {
      id: { type: _graphql.GraphQLString },
      name: { type: _graphql.GraphQLString },
      talk: {
        type: Talk,
        resolve: function resolve(source, args) {
          return _database.database.getTalkByPersonId(source.id);
        }
      }
    };
  }
});

var Talk = new _graphql.GraphQLObjectType({
  name: 'Talk',
  fields: {
    id: { type: _graphql.GraphQLString },
    talker: {
      type: Person,
      resolve: function resolve(source, args) {
        return _database.database.getPersonByTalkId(source.id);
      }
    },
    title: { type: _graphql.GraphQLString }
  }
});

var KitsCon = new _graphql.GraphQLObjectType({
  name: 'KitsCon',
  description: 'Conference API, the right way',
  fields: {
    id: { type: _graphql.GraphQLString },
    date: { type: _graphql.GraphQLString },
    talks: {
      type: new _graphql.GraphQLList(Talk),
      resolve: function resolve() {
        return _database.database.getTalks();
      }
    },
    attendees: {
      type: new _graphql.GraphQLList(Person),
      resolve: function resolve(source, args) {
        return _database.database.getPersons();
      }
    }
  }
});

var Query = new _graphql.GraphQLObjectType({
  name: 'Query',
  description: 'Root query',
  fields: {
    kitscon: {
      type: KitsCon,
      args: {
        id: { type: _graphql.GraphQLString }
      },
      resolve: function resolve(source, args) {
        return _database.database.getConferenceById(args.id);
      }
    }
  }
});

var schema = new _graphql.GraphQLSchema({
  query: Query
});

exports.default = schema;