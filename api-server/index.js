const express = require('express')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

// Create server
const app = express()
app.use(bodyParser.json())

// Create database instance and start server
const adapter = new FileAsync('../data/db.json')
low(adapter)
  .then(db => {
    // Routes
    // GET /hello
    app.get('/hello', (req, res) => {
      const post = db.get('hello')
        .value()

      res.send(post)
    })

    // POST /posts
    app.post('/new-hello', (req, res) => {
      db.set('hello', req.body.newHello)
        .write()
        .then(({ hello }) => res.send(hello))
    })

    // Set db default values
    return db.defaults({ hello: 'Hello world' }).write()
  })
  .then(() => {
    app.listen(5000, () => console.log('listening on port 5000'))
  })
