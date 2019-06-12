import { gql } from 'apollo-server'

export default gql`
  type Config {
    filename: String!
    repos: [Repo]
  }

  type Repo {
    id: String
    name: String
  }

  type Query {
    config: Config
    allRepos: [Repo]
    repo(id: String!): Repo
  }

  type Mutation {
    addRepo(name: String!): Repo
  }
`
