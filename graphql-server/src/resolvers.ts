import loki from 'lokijs'

const db = new loki('../data/loki.json', {
  autosave: true,
})

const hello = db.addCollection('hello')
hello.insert({ text: 'Hello World' })

export const resolvers = {
  Query: {
    hello: async () => {
      return hello.get(1)
    },
  },
  Mutation: {
    newHello: async (_source: any, props: { newHello: string }, _data: any) => {
      hello
        .chain()
        .find({ text: { $exists: true } })
        .update((data: { text: string }) => (data.text = props.newHello))

      return hello.get(1)
    },
  },
}
