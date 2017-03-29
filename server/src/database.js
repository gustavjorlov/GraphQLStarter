const Talks = [
  {
    id: 'one',
    title: 'GraphQL - the dark side',
    transcript: `Bacon ipsum dolor amet sausage shank filet mignon beef, beef ribs rump turducken corned beef doner tri-tip. Flank pork landjaeger fatback, tongue turkey kevin biltong.`,
    attendees: ['1', '2', '3', '5', '9']
  },
  {
    id: 'two',
    title: 'GraphQL - en upptäcksresa',
    transcript: `Unknown...`,
    attendees: ['1', '5', '4', '2', '10']
  },
  {
    id: 'three',
    title: 'Krocka - en säkerhet!',
    transcript: `Bang bang, you shot me down...`,
    attendees: ['6', '1', '5', '4']
  }
];

const Persons = [
  {id: '1', name: 'Gustav', age: 28},
  {id: '2', name: 'Robert', age: 29},
  {id: '3', name: 'Joakim', age: 11},
  {id: '4', name: 'Stephen', age: 32},
  {id: '5', name: 'Jonas', age: 40},
  {id: '6', name: 'Sofia', age: 29},
  {id: '7', name: 'Oscar', age: 44},
  {id: '8', name: 'Mathias', age: 24},
  {id: '9', name: 'Ola', age: 42},
  {id: '10', name: 'Anders', age: 39},
]

const PersonsTalks = [
  {personId: '1', talkId: 'one'},
  {personId: '2', talkId: 'two'},
  {personId: '6', talkId: 'three'}
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
  getPersonsByTalkIds: ids => {
    const personIds = PersonsTalks.filter(join => ids.indexOf(join.talkId) !== -1).map(joinRow => joinRow.personId);
    return Persons.filter(person => personIds.indexOf(person.id) !== -1);
  },
  getPersons: () => Persons,
  getPersonsByIds: ids => new Promise((resolve, reject) => {
    console.log(ids);
    resolve(Persons.filter(person => ids.indexOf(person.id) !== -1));
  }),
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
