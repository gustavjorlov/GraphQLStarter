import React from 'react';
import { gql, graphql } from 'react-apollo';

const Attendees = ({data}) => {
  if (data.loading){ return (<h1>Laddar...</h1>) } else {
    const {attendees} = data;
    return (
      <div>
        <h2>Attendees!</h2>
        <ul>
          {attendees.map(attendee => {
            return (<li key={attendee.id}>{attendee.name} - {attendee.talk ? attendee.talk.title : ':('}</li>);
          })}
        </ul>
      </div>
    );
  }
};

export default graphql(gql`
  query Attendees {
    attendees {
      id,
      name,
      talk {
        title
      }
    }
  }`
)(Attendees);
