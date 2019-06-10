const loki = require('lokijs')

const db = new loki('../data/loki.json', { autosave: true })
const hello = db.addCollection('hello')
hello.insert({text:'Hello World'})

exports.resolvers = {
  Query: {
    hello: async (_source, _args, _data) => {
      return hello.get(1)
    },
  },
  Mutation: {
    newHello: async (_sourse, { newHello }, _data) => {
      hello.chain()
        .find({'text': {'$exists': true}})
        .update(data => data.text = newHello)

      return hello.get(1)
    }
  }
}
