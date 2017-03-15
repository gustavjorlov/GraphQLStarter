'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Talks = [{ id: 'one', title: 'GraphQL - the dark side' }, { id: 'two', title: 'GraphQL - en upptäcksresa' }];

var Persons = [{ id: '1', name: 'Gustav' }, { id: '2', name: 'Robert' }, { id: '3', name: 'Joakim' }, { id: '4', name: 'Stephen' }, { id: '5', name: 'Jonas' }];

var PersonsTalks = [{ personId: '1', talkId: 'one' }, { personId: '2', talkId: 'two' }];

var database = exports.database = {
  getTalks: function getTalks() {
    return Talks;
  },
  getConferenceById: function getConferenceById(id) {
    return {
      id: id,
      date: "25-28 maj"
    };
  },
  getPersonByTalkId: function getPersonByTalkId(id) {
    var personId = PersonsTalks.filter(function (join) {
      return join.talkId === id;
    })[0].personId;
    var person = Persons.filter(function (_person) {
      return _person.id === personId;
    });
    return person[0];
  },
  getPersons: function getPersons() {
    return Persons;
  },
  getTalkByPersonId: function getTalkByPersonId(id) {
    var personTalk = PersonsTalks.filter(function (join) {
      return join.personId === id;
    })[0];
    if (personTalk) {
      var talk = Talks.filter(function (_talk) {
        return _talk.id === personTalk.talkId;
      });
      return talk[0];
    }
  }
};