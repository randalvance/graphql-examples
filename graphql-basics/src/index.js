import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

import { users as origUsers } from './data/users';
import { posts as origPosts } from './data/posts';
import { comments as origComments } from './data/comments';

let users = origUsers;
let posts = origPosts;
let comments = origComments;

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(userId: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(postId: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(commentId: ID!): Comment!
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

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        authorId: ID!
    }

    input CreateCommentInput {
        text: String!
        authorId: ID!
        postId: ID!
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
            const emailTaken = users.some(u => u.email.toLowerCase() === args.data.email.toLowerCase());

            if (emailTaken) {
                throw new Error(`Email ${args.data.email} is already taken!`);
            }

            const user = {
                id: uuid(),
                ...args.data,
            };

            users.push(user);

            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const { userId } = args;
            const userToDelete = users.find(u => u.id === userId);

            if (!userToDelete) {
                throw new Error(`User with id ${userId} does not exist!`);
            }

            users = users.filter(u => u.id !== userId);
            posts = posts.filter((post) => {
                const match = post.author === userId;

                if (match) {
                    comments = comments.filter(c => c.post === post.id);
                }

                return !match;
            });
            comments = comments.filter(c => c.author !== userId);

            return userToDelete;
        },
        createPost(parent, args, ctx, info) {
            const { title, body, published, authorId } = args.data;

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
        deletePost(parent, args, ctx, info) {
            const { postId } = args;
            const postIndex = posts.findIndex(p => p.id === postId);

            if (postIndex === -1) {
                throw new Error(`Post with ID ${postId} does not exist!`);
            }

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter((comment) => comment.post !== postId);
            
            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {
            const { text, authorId, postId } = args.data;

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
        },
        deleteComment(parent, args, ctx, info) {
            const { commentId } = args;
            const commentIndex = comments.findIndex(c => c.id === commentId);

            if (commentIndex === -1) {
                throw new Error(`Comment with ID ${commentId} does not exist!`);
            }

            const deletedComments = comments.splice(commentIndex, 1);

            comments = comments.filter((comment) => comment.id !== commentId);

            return deletedComments[0];
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