import React from 'react';
import { gql, graphql } from 'react-apollo';
import Talks from './Talks';
import Attendees from './Attendees';

const KitsCon = ({data}) => {
  if (data.loading){
    return (<h1>Laddar...</h1>);
  } else {
    const {date, id} = data.kitscon;
    return (<div>
      <h1>KitsCon {id}</h1><h4>{date}</h4>
      <Talks />
      <Attendees />
    </div>);
  }
};

export default graphql(gql`query KitsCon {
  kitscon(id: "17.1") {
    id,
    date
  }
}`)(KitsCon);
