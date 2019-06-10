import React from 'react'
import logo from './logo.svg'
import './App.css'

import { Query, Mutation } from 'react-apollo'
import { gql } from 'apollo-boost'

const GET_HELLO = gql`
  query GetHello {
    hello {
      text
    }
  }
`

function App() {
  const [inputValue, setInputValue] = React.useState('')

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Query
          query={ GET_HELLO }
        >
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error :(</p>

            return data.hello.text
          }}
        </Query>
        <Mutation
          mutation={gql`
            mutation MutateHello($newHello: String!) {
              newHello(newHello: $newHello) {
                text
              }
            }
          `}
          update={(cache, { data: { newHello } }) => {
            cache.writeQuery({
              query: GET_HELLO,
              data: { hello: newHello },
            });
          }}
        >
          {newHello => (
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  newHello({ variables: { newHello: inputValue } });
                  setInputValue('')
                }}
              >
                <input type="text" value={inputValue} onChange={({ target }) => setInputValue(target.value)} />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </Mutation>
      </header>
    </div>
  )
}

export default App
