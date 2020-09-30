import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

const resolvers = {
    Query: {
        hello() {
            return 'This is my first query!';
        },
        name() {
            return 'Randal Cunanan';
        },
        location() {
            return 'Singapore';
        },
        bio() {
            return 'I code stuffs!';
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers,
});

server.start(() => {
    console.log('Server is running at port 4000!');
});