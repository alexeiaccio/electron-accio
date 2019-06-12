import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

const GET_CONFIG = gql`
  query GetCongig {
    config {
      filename
      repos {
        id
        name
      }
    }
  }
`;

function App() {
  const [inputValue, setInputValue] = React.useState('');

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Query query={GET_CONFIG}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :(</p>;

            return (
              <div>
                <p>{data.config.filename}</p>
                <ul>
                  {data.config.repos &&
                    data.config.repos.map(({ id, name }) => (
                      <li key={id}>{name}</li>
                    ))}
                </ul>
                <Mutation
                  mutation={gql`
                    mutation MutationCofig($name: String!) {
                      addRepo(name: $name) {
                        id
                        name
                      }
                    }
                  `}
                  update={(cache, { data: { addRepo } }) => {
                    cache.writeQuery({
                      query: GET_CONFIG,
                      data: {
                        config: {
                          ...data.config,
                          repos: data.config.repos.concat(addRepo),
                        },
                      },
                    });
                  }}
                >
                  {addRepo => (
                    <div>
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          addRepo({ variables: { name: inputValue } });
                          setInputValue('');
                        }}
                      >
                        <input
                          type="text"
                          value={inputValue}
                          onChange={({ target }) => setInputValue(target.value)}
                        />
                        <button type="submit">Submit</button>
                      </form>
                    </div>
                  )}
                </Mutation>
              </div>
            );
          }}
        </Query>
      </header>
    </div>
  );
}

export default App;
