import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

function App() {
  React.useEffect(() => {}, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Query
          query={gql`
            {
              hello(name: "Accio")
            }
          `}
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return data.hello;
          }}
        </Query>
      </header>
    </div>
  );
}

export default App;
