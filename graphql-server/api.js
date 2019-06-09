const { RESTDataSource } = require('apollo-datasource-rest')

class API extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://localhost:5000/'
  }

  async getHello() {
    return this.get('hello')
  }

  async newHello(newHello) {
    return this.post('new-hello', { newHello })
  }
}

exports.API = API
