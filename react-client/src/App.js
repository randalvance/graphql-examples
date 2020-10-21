import React from 'react';
import { ApolloProvider } from '@apollo/client';

import apolloClient from './apolloClient';

import './App.css';

import { Home } from './pages/Home';

function App() {
  return (
    <div className="App">
      <ApolloProvider client={apolloClient}>
        <Home />
      </ApolloProvider>
    </div>
  );
}

export default App;
