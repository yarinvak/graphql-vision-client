import {gql} from 'apollo-server';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors';
import {GraphQLVisionPlugin} from 'graphql-vision-plugin';

const books = [
    {
        title: 'Harry Potter and the Chamber of Secrets',
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

const typeDefs = gql`
    type Book {
        title: String
        author: String
    }
    type Query {
        books: [Book]
    }
`;

const resolvers = {
    Query: {
        books: () => books,
    },
};

const app = express();

app.get('/keepAlive', cors(), (req, res) => res.sendStatus(200));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    tracing: true,
    plugins: [new GraphQLVisionPlugin('http://localhost:4003/graphql', 'ליבת הטייסת', 4000)]
});

server.applyMiddleware({app});


const port = 4002;
app.listen(port, (() => {
    console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
}));
