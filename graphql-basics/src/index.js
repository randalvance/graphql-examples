import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

import { users } from './data/users';
import { posts } from './data/posts';
import { comments } from './data/comments';

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User!
        createPost(title: String!, body: String!, published: Boolean!, authorId: ID!): Post!
        createComment(text: String!, authorId: ID!, postId: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]
        comments: [Comment!]
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post
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
        },
        comments(parent, args, ctx, info) {
            return comments;
        },
        me() {
            return {
                id: '123098',
                name: 'Randal',
                email: 'randal@randalvance.net',
            }
        },
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(u => u.email.toLowerCase() === args.email.toLowerCase());

            if (emailTaken) {
                throw new Error(`Email ${args.email} is already taken!`);
            }

            const user = {
                id: uuid(),
                ...args,
            };

            users.push(user);

            return user;
        },
        createPost(parent, args, ctx, info) {
            const { title, body, published, authorId } = args;

            const userExists = users.some(u => u.id === authorId);

            if (!userExists) {
                throw new Error(`User with id ${authorId} does not exist!`);
            }

            const post = {
                id: uuid(),
                title,
                body,
                published,
                author: authorId
            };

            posts.push(post);

            return post;
        },
        createComment(parent, args, ctx, info) {
            const { text, authorId, postId } = args;

            const userExists = users.some(u => u.id === authorId);

            if (!userExists) {
                throw new Error(`User with id ${authorId} does not exist!`);
            }

            const post = posts.find(p => p.id === postId);
            
            if (!post) {
                throw new Error(`Post with id ${postId} does not exist!`);
            }

            if (!post.published) {
                throw new Error(`Post with id ${postId} is not yet published!`);
            }

            const comment = {
                id: uuid(),
                text,
                author: authorId,
                post: postId,
            };

            comments.push(comment);

            return comment;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            const authorId = parent.author;
            return users.find(u => u.id === authorId);
        },
        comments(parent, args, ctx, info) {
            const postId = parent.id;
            return comments.filter(c => c.post === postId);
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(p => p.author == parent.id);
        },
        comments(parent, args, ctx, info) {
            return comments.filter(c => c.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(u => u.id === parent.author);
        },
        post(parent, args, ctx, info) {
            return posts.find(p => p.id === parent.post);
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