import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {HashRouter} from 'react-router-dom';
import { ApolloClient, ApolloProvider, createNetworkInterface } from 'react-apollo';
const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:5000/graphql' }),
});

ReactDOM.render(
    <ApolloProvider client={client}>
      <HashRouter><App/></HashRouter>
    </ApolloProvider>,
  document.getElementById('root')
);
