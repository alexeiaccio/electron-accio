/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
const schema_1 = __importDefault(__webpack_require__(/*! ./schema */ "./src/schema/index.ts"));
const resolvers_1 = __webpack_require__(/*! ./resolvers */ "./src/resolvers.ts");
const schema = apollo_server_1.makeExecutableSchema({ typeDefs: schema_1.default, resolvers: resolvers_1.resolvers });
const server = new apollo_server_1.ApolloServer({
    schema,
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
});
server
    .listen({
    port: 4000,
})
    .then((args) => console.log(`Server is running on localhost:${args.port}`));
exports.default = server;


/***/ }),

/***/ "./src/resolvers.ts":
/*!**************************!*\
  !*** ./src/resolvers.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lokijs_1 = __importDefault(__webpack_require__(/*! lokijs */ "lokijs"));
const db = new lokijs_1.default('../data/config.json', {
    autoload: true,
    autosave: true,
});
let config;
db.loadDatabase({}, (err) => {
    if (err) {
        console.log('Error: ' + err);
    }
    else {
        console.log(`Database ${db.filename} loaded`);
        config = db.getCollection('config');
        if (!config) {
            config = db.addCollection('config');
            config.insert({ id: '1', name: 'Test repo' });
        }
    }
});
const getAllRepo = (collection) => __awaiter(this, void 0, void 0, function* () {
    return collection && collection.find({ name: { $exists: true } });
});
exports.resolvers = {
    Query: {
        config: () => __awaiter(this, void 0, void 0, function* () {
            const { filename } = db;
            const repos = yield getAllRepo(config);
            return {
                filename,
                repos,
            };
        }),
        allRepos: () => __awaiter(this, void 0, void 0, function* () { return yield getAllRepo(config); }),
        repo: (_source, props, _data) => __awaiter(this, void 0, void 0, function* () {
            return config ? yield config.findOne({ id: props.id }) : null;
        }),
    },
    Mutation: {
        addRepo: (_source, props, _data) => __awaiter(this, void 0, void 0, function* () {
            const prev = yield config.count();
            const newRepo = { name: props.name, id: prev + 1 };
            config && config.insert(newRepo);
            return newRepo;
        }),
    },
};


/***/ }),

/***/ "./src/schema/config.ts":
/*!******************************!*\
  !*** ./src/schema/config.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = __webpack_require__(/*! apollo-server */ "apollo-server");
exports.default = apollo_server_1.gql `
  type Config {
    filename: String!
    repos: [Repo]
  }

  type Repo {
    id: String
    name: String
  }

  type Query {
    config: Config
    allRepos: [Repo]
    repo(id: String!): Repo
  }

  type Mutation {
    addRepo(name: String!): Repo
  }
`;


/***/ }),

/***/ "./src/schema/index.ts":
/*!*****************************!*\
  !*** ./src/schema/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(__webpack_require__(/*! ./config */ "./src/schema/config.ts"));
exports.default = [
    config_1.default,
];


/***/ }),

/***/ 0:
/*!************************************!*\
  !*** multi core-js ./src/index.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js */"core-js");
module.exports = __webpack_require__(/*! ./src/index.ts */"./src/index.ts");


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "core-js":
/*!**************************!*\
  !*** external "core-js" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("core-js");

/***/ }),

/***/ "lokijs":
/*!*************************!*\
  !*** external "lokijs" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("lokijs");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9yZXNvbHZlcnMudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjaGVtYS9jb25maWcudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjaGVtYS9pbmRleC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhcG9sbG8tc2VydmVyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yZS1qc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImxva2lqc1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxrRkFBa0U7QUFFbEUsK0ZBQStCO0FBQy9CLGlGQUF1QztBQUV2QyxNQUFNLE1BQU0sR0FBRyxvQ0FBb0IsQ0FBQyxFQUFDLFFBQVEsRUFBUixn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QyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBRWhDLE9BQU8sT0FBTztRQUNoQixDQUFDO0tBQ0Y7Q0FDRjs7Ozs7Ozs7Ozs7Ozs7O0FDeERELGtGQUFtQztBQUVuQyxrQkFBZSxtQkFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FvQmpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkQsZ0dBQW1DO0FBRW5DLGtCQUFlO0lBQ2IsZ0JBQVk7Q0FDYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pELDBDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG1DIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJpbXBvcnQgeyBBcG9sbG9TZXJ2ZXIsIG1ha2VFeGVjdXRhYmxlU2NoZW1hIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcblxuaW1wb3J0IHR5cGVEZWZzIGZyb20gJy4vc2NoZW1hJ1xuaW1wb3J0IHsgcmVzb2x2ZXJzIH0gZnJvbSAnLi9yZXNvbHZlcnMnXG5cbmNvbnN0IHNjaGVtYSA9IG1ha2VFeGVjdXRhYmxlU2NoZW1hKHt0eXBlRGVmcywgcmVzb2x2ZXJzfSlcblxuY29uc3Qgc2VydmVyID0gbmV3IEFwb2xsb1NlcnZlcih7XG4gIHNjaGVtYSxcbiAgc3Vic2NyaXB0aW9uczogJy9zdWJzY3JpcHRpb25zJyxcbiAgcGxheWdyb3VuZDoge1xuICAgIGVuZHBvaW50OiAnL3BsYXlncm91bmQnLFxuICB9LFxuICBjb3JzOiB7XG4gICAgb3JpZ2luOiAnKicsXG4gICAgbWV0aG9kczogJ0dFVCxIRUFELFBVVCxQQVRDSCxQT1NULERFTEVURScsXG4gICAgcHJlZmxpZ2h0Q29udGludWU6IGZhbHNlLFxuICAgIG9wdGlvbnNTdWNjZXNzU3RhdHVzOiAyMDQsXG4gIH0sXG59KVxuXG5zZXJ2ZXJcbiAgLmxpc3Rlbih7XG4gICAgcG9ydDogNDAwMCxcbiAgfSlcbiAgLnRoZW4oKGFyZ3M6IGFueSk6IHZvaWQgPT5cbiAgICBjb25zb2xlLmxvZyhgU2VydmVyIGlzIHJ1bm5pbmcgb24gbG9jYWxob3N0OiR7YXJncy5wb3J0fWApXG4gIClcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyXG4iLCJpbXBvcnQgbG9raSBmcm9tICdsb2tpanMnXG5cbmNvbnN0IGRiID0gbmV3IGxva2koJy4uL2RhdGEvY29uZmlnLmpzb24nLCB7XG4gIGF1dG9sb2FkOiB0cnVlLFxuICBhdXRvc2F2ZTogdHJ1ZSxcbn0pXG5cbmxldCBjb25maWc6IGFueVxuXG5kYi5sb2FkRGF0YWJhc2Uoe30sIChlcnIpID0+IHtcbiAgaWYgKGVycikge1xuICAgIGNvbnNvbGUubG9nKCdFcnJvcjogJyArIGVycilcbiAgfVxuICBlbHNlIHtcbiAgICBjb25zb2xlLmxvZyhgRGF0YWJhc2UgJHtkYi5maWxlbmFtZX0gbG9hZGVkYClcblxuICAgIGNvbmZpZyA9IGRiLmdldENvbGxlY3Rpb24oJ2NvbmZpZycpXG4gICAgaWYgKCFjb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IGRiLmFkZENvbGxlY3Rpb24oJ2NvbmZpZycpXG4gICAgICBjb25maWcuaW5zZXJ0KHsgaWQ6ICcxJywgbmFtZTogJ1Rlc3QgcmVwbycgfSlcbiAgICB9XG4gIH1cbn0pXG5cblxuXG5cbmNvbnN0IGdldEFsbFJlcG8gPSBhc3luYyAoY29sbGVjdGlvbjogeyBmaW5kOiBhbnkgfSk6IFByb21pc2U8b2JqZWN0PiA9PiB7XG4gIHJldHVybiBjb2xsZWN0aW9uICYmIGNvbGxlY3Rpb24uZmluZCh7IG5hbWU6IHsgJGV4aXN0czogdHJ1ZSB9IH0pXG59XG5cbmV4cG9ydCBjb25zdCByZXNvbHZlcnMgPSB7XG4gIFF1ZXJ5OiB7XG4gICAgY29uZmlnOiBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IGZpbGVuYW1lIH0gPSBkYlxuICAgICAgY29uc3QgcmVwb3MgPSBhd2FpdCBnZXRBbGxSZXBvKGNvbmZpZylcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZmlsZW5hbWUsXG4gICAgICAgIHJlcG9zLFxuICAgICAgfVxuICAgIH0sXG4gICAgYWxsUmVwb3M6IGFzeW5jICgpID0+IGF3YWl0IGdldEFsbFJlcG8oY29uZmlnKSxcbiAgICByZXBvOiBhc3luYyAoX3NvdXJjZTogYW55LCBwcm9wczogeyBpZDogc3RyaW5nIH0sIF9kYXRhOiBhbnkpID0+IHtcbiAgICAgIHJldHVybiBjb25maWcgPyBhd2FpdCBjb25maWcuZmluZE9uZSh7IGlkOiBwcm9wcy5pZCB9KSA6IG51bGxcbiAgICB9LFxuICB9LFxuICBNdXRhdGlvbjoge1xuICAgIGFkZFJlcG86IGFzeW5jIChfc291cmNlOiBhbnksIHByb3BzOiB7IG5hbWU6IHN0cmluZyB9LCBfZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBwcmV2ID0gYXdhaXQgY29uZmlnLmNvdW50KClcbiAgICAgIGNvbnN0IG5ld1JlcG8gPSB7IG5hbWU6IHByb3BzLm5hbWUsIGlkOiBwcmV2ICsgMSB9XG4gICAgICBjb25maWcgJiYgY29uZmlnLmluc2VydChuZXdSZXBvKVxuXG4gICAgICByZXR1cm4gbmV3UmVwb1xuICAgIH0sXG4gIH0sXG59XG4iLCJpbXBvcnQgeyBncWwgfSBmcm9tICdhcG9sbG8tc2VydmVyJ1xuXG5leHBvcnQgZGVmYXVsdCBncWxgXG4gIHR5cGUgQ29uZmlnIHtcbiAgICBmaWxlbmFtZTogU3RyaW5nIVxuICAgIHJlcG9zOiBbUmVwb11cbiAgfVxuXG4gIHR5cGUgUmVwbyB7XG4gICAgaWQ6IFN0cmluZ1xuICAgIG5hbWU6IFN0cmluZ1xuICB9XG5cbiAgdHlwZSBRdWVyeSB7XG4gICAgY29uZmlnOiBDb25maWdcbiAgICBhbGxSZXBvczogW1JlcG9dXG4gICAgcmVwbyhpZDogU3RyaW5nISk6IFJlcG9cbiAgfVxuXG4gIHR5cGUgTXV0YXRpb24ge1xuICAgIGFkZFJlcG8obmFtZTogU3RyaW5nISk6IFJlcG9cbiAgfVxuYFxuIiwiaW1wb3J0IENvbmZpZ1NjaGVtYSBmcm9tICcuL2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgW1xuICBDb25maWdTY2hlbWEsXG5dXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJhcG9sbG8tc2VydmVyXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcmUtanNcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9raWpzXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=