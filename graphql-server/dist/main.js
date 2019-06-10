!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t){e.exports=require("apollo-server")},function(e,t,n){n(2),e.exports=n(3)},function(e,t){e.exports=require("core-js")},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0),r=n(4),i=n(5),u=new o.ApolloServer({typeDefs:r.typeDefs,resolvers:i.resolvers,subscriptions:"/subscriptions",playground:{endpoint:"/playground"},cors:{origin:"*",methods:"GET,HEAD,PUT,PATCH,POST,DELETE",preflightContinue:!1,optionsSuccessStatus:204}});u.listen({port:4e3}).then(e=>console.log(`Server is running on localhost:${e.port}`)),t.default=u},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(0);t.typeDefs=o.gql`
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
`},function(e,t,n){"use strict";var o=this&&this.__awaiter||function(e,t,n,o){return new(n||(n=Promise))(function(r,i){function u(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){e.done?r(e.value):new n(function(t){t(e.value)}).then(u,l)}s((o=o.apply(e,t||[])).next())})},r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const i=new(r(n(6)).default)("../data/loki.json",{autosave:!0}).addCollection("hello");i.insert({text:"Hello World"}),t.resolvers={Query:{hello:()=>o(this,void 0,void 0,function*(){return i.get(1)})},Mutation:{newHello:(e,t,n)=>o(this,void 0,void 0,function*(){return i.chain().find({text:{$exists:!0}}).update(e=>e.text=t.newHello),i.get(1)})}}},function(e,t){e.exports=require("lokijs")}]);