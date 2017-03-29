import React from 'react';
import { gql, graphql } from 'react-apollo';
import {Link} from 'react-router-dom';

const Talks = ({data}) => {
  if (data.loading){ return (<h1>Laddar...</h1>) } else {
    const {talks} = data;
    return (
      <div>
        <h2>Talks!</h2>
        <ul>
          {talks.map(talk => <li key={talk.id}>
            <Link to={'/talk/'+talk.id}>{talk.title} ({talk.talker.name})</Link>
          </li>)}
        </ul>
      </div>
    );
  }
};

export default graphql(gql`
  query Talks {
    talks {
      id,
      title,
      transcript,
      talker {
        name
      }
    }
  }`
)(Talks);
