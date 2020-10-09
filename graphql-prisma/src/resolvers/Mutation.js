import { v4 as uuid } from "uuid";

export const Mutation = {
  async createUser(parent, args, { db, prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error(`Email ${args.data.email} is already taken!`);
    }

    const user = await prisma.mutation.createUser({ data: args.data }, info);

    return user;
  },
  async updateUser(parent, { userId, data }, { db, prisma }, info) {
    return await prisma.mutation.updateUser({ data, where: { id: userId }}, info);
  },
  async deleteUser(parent, { userId }, { db, prisma }, info) {
    const userExists = await prisma.exists.User({ id: userId });

    if (!userExists) {
      throw new Error(`User with id ${userId} does not exist!`);
    }

    return prisma.mutation.deleteUser({ where: {
      id: userId,
    }}, info);
  },
  async createPost(parent, args, { db, pubSub, prisma }, info) {
    return prisma.mutation.createPost({ data: {
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: {
        connect: {
          id: args.data.authorId,
        },
      }
    } }, info);
  },
  updatePost(parent, { postId, data }, { prisma }, info) {
    return prisma.mutation.updatePost({
      data,
      where: { id: postId },
    }, info);
  },
  deletePost(parent, { postId }, { pubSub, db, prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: postId } }, info);
  },
  createComment(parent, args, { db, pubSub }, info) {
    const { text, authorId, postId } = args.data;

    const userExists = db.users.some((u) => u.id === authorId);

    if (!userExists) {
      throw new Error(`User with id ${authorId} does not exist!`);
    }

    const post = db.posts.find((p) => p.id === postId);

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

    pubSub.publish(`comments of post ${postId}`, {
      comment: {
        mutation: 'CREATED',
        data: comment,
      }
    });

    return comment;
  },
  updateComment(parent, { commentId, data }, { db, pubSub }, info) {
    const comment = db.comments.find((c) => c.id === commentId);

    if (!comment) {
      throw new Error(`Comment with ID ${commentId} does not exist!`);
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubSub.publish(`comments of post ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment,
      }
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubSub }, info) {
    const { commentId } = args;
    const commentIndex = db.comments.findIndex((c) => c.id === commentId);

    if (commentIndex === -1) {
      throw new Error(`Comment with ID ${commentId} does not exist!`);
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    db.comments = db.comments.filter((comment) => comment.id !== commentId);

    pubSub.publish(`comments of post ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });

    return deletedComment;
  },
};
