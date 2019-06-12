import loki from 'lokijs'

const db = new loki('../data/config.json', {
  autoload: true,
  autosave: true,
})

let config: any

db.loadDatabase({}, (err) => {
  if (err) {
    console.log('Error: ' + err)
  }
  else {
    console.log(`Database ${db.filename} loaded`)

    config = db.getCollection('config')
    if (!config) {
      config = db.addCollection('config')
      config.insert({ id: '1', name: 'Test repo' })
    }
  }
})




const getAllRepo = async (collection: { find: any }): Promise<object> => {
  return collection && collection.find({ name: { $exists: true } })
}

export const resolvers = {
  Query: {
    config: async () => {
      const { filename } = db
      const repos = await getAllRepo(config)

      return {
        filename,
        repos,
      }
    },
    allRepos: async () => await getAllRepo(config),
    repo: async (_source: any, props: { id: string }, _data: any) => {
      return config ? await config.findOne({ id: props.id }) : null
    },
  },
  Mutation: {
    addRepo: async (_source: any, props: { name: string }, _data: any) => {
      const prev = await config.count()
      const newRepo = { name: props.name, id: prev + 1 }
      config && config.insert(newRepo)

      return newRepo
    },
  },
}
