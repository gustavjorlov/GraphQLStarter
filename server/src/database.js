const Talks = [
  {
    id: 'one',
    title: 'GraphQL - the dark side',
    transcript: `Bacon ipsum dolor amet sausage shank filet mignon beef, beef ribs rump turducken corned beef doner tri-tip. Flank pork landjaeger fatback, tongue turkey kevin biltong. Swine ribeye prosciutto, filet mignon beef spare ribs biltong. Ground round pastrami jerky brisket, ham hock chicken leberkas prosciutto.Boudin frankfurter flank ham hock pastrami. Beef ribs hamburger pork loin strip steak, short ribs corned beef frankfurter. Cupim pork loin salami, jowl kielbasa rump ham hock ball tip alcatra cow swine meatball shankle bresaola frankfurter. Venison ham capicola, salami pancetta leberkas andouille shankle doner. Biltong bresaola shank, porchetta pig prosciutto pancetta capicola fatback shoulder jowl cupim. Cupim rump flank turkey chuck tail. Corned beef frankfurter sausage pork loin short ribs. T-bone venison pork belly, shank strip steak swine tri-tip. Pork shoulder cow beef ribs filet mignon pork chop, kielbasa rump ground round jerky. Andouille ribeye corned beef, boudin swine pancetta jerky shank meatball shankle drumstick. Pork loin pork chop pancetta ribeye venison kielbasa doner beef. Tail kielbasa porchetta brisket. Strip steak kielbasa kevin burgdoggen hamburger boudin. Pork chop jerky porchetta cupim bacon corned beef. Pork cupim short loin chicken burgdoggen strip steak rump jowl bacon capicola turducken. Shoulder flank bresaola ball tip sausage. Shoulder bresaola meatloaf jowl kevin rump burgdoggen. Pork loin biltong jowl pork doner pork chop, ground round tongue andouille turducken ham hock fatback hamburger. Spare ribs short ribs jerky prosciutto. Bresaola jowl ribeye capicola rump. Alcatra strip steak swine, venison sirloin frankfurter brisket picanha ham hock rump spare ribs hamburger. Meatloaf picanha pork belly jowl t-bone hamburger prosciutto tail shank. Chuck doner short loin landjaeger, ribeye pork chop t-bone turkey biltong short ribs. Ham rump ball tip cupim, leberkas boudin swine tenderloin. Kielbasa ribeye biltong salami picanha.`
  },
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
