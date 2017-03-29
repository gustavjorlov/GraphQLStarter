import React from 'react';
import { gql, graphql } from 'react-apollo';
import Talks from './Talks';
import Attendees from './Attendees';
import MainView from './MainView';

const KitsCon = ({data}) => {
  if (data.loading){
    return (<h1>Laddar...</h1>);
  } else {
    const {date, id} = data.kitscon;
    return (<div className="page">
      <header>
        <h1>KitsCon {id}</h1><h4>{date}</h4>
      </header>
      <div className="content">
        <div className="sidebar">
          <Talks />
          <Attendees />
        </div>
        <div className="main">
          <MainView />
        </div>
      </div>
    </div>);
  }
};

export default graphql(gql`query KitsCon {
  kitscon(id: "17.1") {
    id,
    date
  }
}`)(KitsCon);
