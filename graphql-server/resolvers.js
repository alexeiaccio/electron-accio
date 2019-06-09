exports.resolvers = {
  Query: {
    hello: async (_source, _args, { dataSources }) => {
      return dataSources.API.getHello()
    },
  },
  Mutation: {
    newHello: async (_sourse, { newHello }, { dataSources }) => {
      return dataSources.API.newHello(newHello)
    }
  }
}
