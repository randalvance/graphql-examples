import { GraphQLServer } from 'graphql-yoga';
import resolvers from './resolvers';
import database from './database';

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        database
    }
});

server.start({ port: 5555 }, () => {
    console.log('Server is available at port 5555...');
});