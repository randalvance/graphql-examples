import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        greeting(name: String): String!
        me: User!
        post: Post!
        add(numbers: [Float!]!): Int!
        grades: [Int!]!
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
        greeting(parent, args, ctx, info) {
            if (args.name) {
                return `Hello, ${args.name}!`;
            }
            return 'Hello Stranger!';
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
        },
        add(parent, args, ctx, info) {
            if (args.numbers.length == 0) {
                return 0;
            }
            return args.numbers.reduce((sum, curr) => sum + curr , 0);
        },
        grades(parent, args, ctx, info) {
            return [99, 80, 93];
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