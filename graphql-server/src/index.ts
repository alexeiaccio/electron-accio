import { ApolloServer } from 'apollo-server'

import { typeDefs } from './type-defs'
import { resolvers } from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: '/subscriptions',
  playground: {
    endpoint: '/playground',
  },
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  },
})

server
  .listen({
    port: 4000,
  })
  .then((args: any): void =>
    console.log(`Server is running on localhost:${args.port}`)
  )

export default server
