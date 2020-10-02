import { GraphQLServer } from 'graphql-yoga';
import { users } from './data/users';

const typeDefs = `
    type Query {
        users: [User!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users;
        },
        me() {
            return {
                id: '123098',
                name: 'Randal',
                email: 'randal@randalvance.net',
            }
        },
        post() {
            return {
                id: '12345',
                title: 'My Awesome Post',
                body: 'This is my awesome post.',
                published: true,
            }
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