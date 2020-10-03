import { v4 as uuid } from 'uuid';

export const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(u => u.email.toLowerCase() === args.data.email.toLowerCase());

        if (emailTaken) {
            throw new Error(`Email ${args.data.email} is already taken!`);
        }

        const user = {
            id: uuid(),
            ...args.data,
        };

        db.users.push(user);

        return user;
    },
    deleteUser(parent, args, { db }, info) {
        const { userId } = args;
        const userToDelete = db.users.find(u => u.id === userId);

        if (!userToDelete) {
            throw new Error(`User with id ${userId} does not exist!`);
        }

        db.users = db.users.filter(u => u.id !== userId);
        db.posts = db.posts.filter((post) => {
            const match = post.author === userId;

            if (match) {
                comments = db.comments.filter(c => c.post === post.id);
            }

            return !match;
        });
        db.comments = db.comments.filter(c => c.author !== userId);

        return userToDelete;
    },
    createPost(parent, args, { db }, info) {
        const { title, body, published, authorId } = args.data;

        const userExists = db.users.some(u => u.id === authorId);

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

        db.posts.push(post);

        return post;
    },
    deletePost(parent, args, { db }, info) {
        const { postId } = args;
        const postIndex = db.posts.findIndex(p => p.id === postId);

        if (postIndex === -1) {
            throw new Error(`Post with ID ${postId} does not exist!`);
        }

        const deletedPosts = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter((comment) => comment.post !== postId);
        
        return deletedPosts[0];
    },
    createComment(parent, args, { db }, info) {
        const { text, authorId, postId } = args.data;

        const userExists = db.users.some(u => u.id === authorId);

        if (!userExists) {
            throw new Error(`User with id ${authorId} does not exist!`);
        }

        const post = db.posts.find(p => p.id === postId);
        
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

        db.comments.push(comment);

        return comment;
    },
    deleteComment(parent, args, { db }, info) {
        const { commentId } = args;
        const commentIndex = db.comments.findIndex(c => c.id === commentId);

        if (commentIndex === -1) {
            throw new Error(`Comment with ID ${commentId} does not exist!`);
        }

        const deletedComments =  db.comments.splice(commentIndex, 1);

        db.comments =  db.comments.filter((comment) => comment.id !== commentId);

        return deletedComments[0];
    }
};