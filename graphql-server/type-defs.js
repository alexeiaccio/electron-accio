const { gql } = require('apollo-server');

exports.typeDefs = gql`
  type LokiMeta {
    revision: Int
    created: Int
    version: Int
    updated: Int
  }
  type Hello {
    text: String
  }
  type Query {
    hello: Hello
  }
  type Mutation {
    newHello(newHello: String): Hello
  }
`