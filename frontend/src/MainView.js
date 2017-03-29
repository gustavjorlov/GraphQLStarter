import React from 'react';
import { gql, graphql } from 'react-apollo';
import {Route} from 'react-router-dom';

const renderTalk = ({match}) => {
  console.log(match);
  return (<h1>Talk! {match.params.id}</h1>);
};

const MainView = (props) => {
  console.log(props);
  return (<div>
    <Route path='/talk/:id' component={renderTalk} />
  </div>);
};

export default graphql(gql`
  query Talks {
    talks{
      id,
      title,
      transcript,
      talker {
        name
      }
    }
  }`,
  {props: stuff => {
    console.log(stuff);
    return stuff;
  }}
)(MainView);
