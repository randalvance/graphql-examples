import { GraphQLServer } from 'graphql-yoga';
import { users } from './data/users';
import { posts } from './data/posts';

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
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
            if (!args.query) {
                return users;
            }
            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
        },
        me() {
            return {
                id: '123098',
                name: 'Randal',
                email: 'randal@randalvance.net',
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }
            return posts.filter(post => {
                const searchTerm = args.query.toLowerCase();
                const matchingTitle = post.title.toLowerCase().includes(searchTerm);
                const matchingBody = post.body.toLowerCase().includes(searchTerm);
                return matchingTitle || matchingBody;
            });
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