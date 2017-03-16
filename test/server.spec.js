import {expect} from 'chai';
import {run} from '../src/server';

describe('GraphQL server', () => {
  it('should run graphql', () => {
    return run(`{
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
    }`).then(response => {
      expect(response.data.kitscon.id).to.equal('17.1');
      // console.log(JSON.stringify(response, null, 2));
    });
  });

  it('should ask for attendees', () => {
    return run(`{
      kitscon(id: "17.1"){
        attendees {name}
      }
    }`).then(response => {
      expect(response.data.kitscon.attendees).to.be.instanceof(Array);
      // console.log(JSON.stringify(response, null, 2));
    });
  });
});
