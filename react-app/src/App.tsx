import React from 'react';

import { useQuery, useMutation } from 'urql';

import logo from './logo.svg';
import './App.css';

const getConfig = `
  query GetConfig {
    config {
      filename
      repos {
        id
        name
      }
    }
  }
`;

const addRepo = `
  mutation MutationCofig($name: String!) {
    addRepo(name: $name) {
      id
      name
    }
  }
`

const App: React.FC = () => {
  const [inputValue, setInputValue] = React.useState('');

  const [res] = useQuery({
    query: getConfig,
    requestPolicy: 'cache-and-network',
  });
  const [updated, executeMutation] = useMutation(addRepo);
  if (res.fetching) {
    return <div>Loading...</div>;
  } else if (res.error) {
    return <div>Oh no!</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{res.data.config.filename}</p>
        <ul>
          {res.data.config.repos &&
            res.data.config.repos.map((repo: { id: string, name: string }) => (
              <li key={repo.id}>{repo.name}</li>
            ))}
        </ul>
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();
              executeMutation({ name: inputValue });
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
        {updated.error && <div>Oh no!</div>}
      </header>
    </div>
  );
}

export default App;
