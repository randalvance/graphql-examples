import { v4 as uuid } from "uuid";

export const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });

    if (emailTaken) {
      throw new Error(`Email ${args.data.email} is already taken!`);
    }

    const user = await prisma.mutation.createUser({ data: args.data }, info);

    return user;
  },
  async updateUser(parent, { userId, data }, { prisma }, info) {
    return await prisma.mutation.updateUser({ data, where: { id: userId }}, info);
  },
  async deleteUser(parent, { userId }, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: userId });

    if (!userExists) {
      throw new Error(`User with id ${userId} does not exist!`);
    }

    return prisma.mutation.deleteUser({ where: {
      id: userId,
    }}, info);
  },
  async createPost(parent, args, { prisma }, info) {
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
  deletePost(parent, { postId }, { prisma }, info) {
    return prisma.mutation.deletePost({ where: { id: postId } }, info);
  },
  createComment(parent, { data }, { prisma }, info) {
    return prisma.mutation.createComment({
      data: {
        text: data.text,
        author: {
          connect: {
            id: data.authorId,
          },
        },
        post: {
          connect: {
            id: data.postId,
          },
        },
      },
    }, info);
  },
  updateComment(parent, { commentId, data }, { prisma }, info) {
    return prisma.mutation.updateComment({
      data,
      where: {
        id: commentId,
      },
    }, info);
  },
  deleteComment(parent, { commentId }, { prisma }, info) {
    return prisma.mutation.deleteComment({
      where: {
        id: commentId,
      },
    }, info)
  },
};
