"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var graphql_request_1 = require("graphql-request");
// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
var books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
var typeDefs = (_a = ["\n    # Comments in GraphQL are defined with the hash (#) symbol.\n\n    # This \"Book\" type can be used in other type declarations.\n    type Book {\n        title: String\n        author: String\n    }\n\n    # The \"Query\" type is the root of all GraphQL queries.\n    # (A \"Mutation\" type will be covered later on.)\n    type Query {\n        books: [Book]\n    }\n"], _a.raw = ["\n    # Comments in GraphQL are defined with the hash (#) symbol.\n\n    # This \"Book\" type can be used in other type declarations.\n    type Book {\n        title: String\n        author: String\n    }\n\n    # The \"Query\" type is the root of all GraphQL queries.\n    # (A \"Mutation\" type will be covered later on.)\n    type Query {\n        books: [Book]\n    }\n"], apollo_server_1.gql(_a));
// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
var resolvers = {
    Query: {
        books: function () { return books; },
    },
};
var trace = "mutation($tracing: TracerInput) {\n  addTracing(tracing: $tracing)\n}";
// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
var server = new apollo_server_1.ApolloServer({
    typeDefs: typeDefs, resolvers: resolvers, tracing: true, plugins: [{
            requestDidStart: function (_a) {
                return {
                    willSendResponse: function (_a) {
                        var response = _a.response;
                        console.log(JSON.stringify(response.extensions.tracing));
                        graphql_request_1.request('http://localhost:4000/v1/graphql', trace, { tracing: response.extensions.tracing }).then(function () {
                            console.log('success');
                        });
                    }
                };
            }
        }]
});
// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen({ port: 4002 }).then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80  Server ready at " + url);
});
var _a;
