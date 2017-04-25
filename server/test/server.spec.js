import {expect} from 'chai';
import {run} from '../src/server';

describe('GraphQL server', () => {
  it('should get an employee and his skills recursively', () => {
    return run(`{
      employee(id: "1"){
        id,
        name,
        skills {
          id,
          title,
          masters{
            id,
            name,
            skills {
              id,
              title,
              masters {
                id,
                name,
                skills {
                  id,
                  title
                }
              }
            }
          }
        }
      }
    }`).then(response => {
      console.log(JSON.stringify(response, null, 2));
    });
  });

  it('should get a skill', () => {
    return run(`{
      skill(id: "2"){
        id,
        title,
        masters{
          name
        }
      }
    }`).then(response => {
      console.log(JSON.stringify(response, null, 2));
    });
  });

  it.skip('should run graphql', () => {
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

  it.skip('should ask for attendees', () => {
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

  it.skip('should ask for talks', () => {
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
