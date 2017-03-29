import {expect} from 'chai';
import {run} from '../dist/server';

describe('GraphQL server', () => {
  it('should run graphql', () => {
    return run(`{
      kitscon(id: "17.1"){
        id,
        date,
        attendees {
          id,
          name,
          age,
          talk {
            title,
            attendees {
              name, age
            }
          }
        },
        talks {
          id,
          title,
          transcript,
          talker {
            id,
            name
          },
          attendees {
            name
          }
        }
      }
    }`).then(response => {
      console.log(JSON.stringify(response, null, 2));
      expect(response.data.kitscon.id).to.equal('17.1');
    });
  });

  it('should ask for attendees', () => {
    return run(`{
      attendees {
        name,
        talk {
          title
        }
      }
    }`).then(response => {
      expect(response.data.attendees).to.be.instanceof(Array);
    });
  });

  it('should ask for talks', () => {
    return run(`{
      talks {title, transcript,
        talker {
          name
        }
      }
    }`).then(response => {
      expect(response.data.talks).to.be.instanceof(Array);
    });
  });
});
