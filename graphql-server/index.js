const { ApolloServer } = require('apollo-server');

const { typeDefs } = require('./type-defs')
const { resolvers } = require('./resolvers')
const { API } = require('./api')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      API: new API(),
    };
  },
  subscriptions: '/subscriptions',
  playground: {
    endpoint: '/playground',
  },
  cors: {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }
})

server.listen({
  port: 4000,
}).then(({ port }) => console.log(`Server is running on localhost:${port}`))
