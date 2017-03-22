const Talks = [
  {id: 'one', title: 'GraphQL - the dark side'},
  {id: 'two', title: 'GraphQL - en upptäcksresa'}
];

const Persons = [
  {id: '1', name: 'Gustav'},
  {id: '2', name: 'Robert'},
  {id: '3', name: 'Joakim'},
  {id: '4', name: 'Stephen'},
  {id: '5', name: 'Jonas'},
]

const PersonsTalks = [
  {personId: '1', talkId: 'one'},
  {personId: '2', talkId: 'two'}
];

export const database = {
  getTalks: () => Talks,
  getConferenceById: id => ({
    id,
    date: "25-28 maj"
  }),
  getPersonByTalkId: id => {
    const personId = PersonsTalks.filter(join => join.talkId === id)[0].personId;
    const person = Persons.filter(_person => _person.id === personId);
    return person[0];
  },
  getPersons: () => Persons,
  getTalkByPersonId: id => {
    const personTalk = PersonsTalks.filter(join => join.personId === id)[0];
    if (personTalk) {
      const talk = Talks.filter(_talk => _talk.id === personTalk.talkId);
      return talk[0];
    }

  },
  addAttendee: name => {
    const _newPerson = {id: Date.now(), name};
    Persons.push(_newPerson);
    return _newPerson;
  }
};
