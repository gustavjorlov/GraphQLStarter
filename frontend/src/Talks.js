import React from 'react';
import { gql, graphql } from 'react-apollo';

const Talks = ({data}) => {
  if (data.loading){ return (<h1>Laddar...</h1>) } else {
    const {talks} = data;
    return (
      <div>
        <h2>Talks!</h2>
        <ul>
          {talks.map(talk => <li key={talk.id}>{talk.title} ({talk.talker.name})</li>)}
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
      talker {
        name
      }
    }
  }`
)(Talks);
