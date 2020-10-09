import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../auth/config';
import { getUserId } from '../auth/getUserId';

export const Mutation = {
  async createUser(parent, { data }, { prisma }, info) {
    if (data.password < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.mutation.createUser({
      data: {
        ...data,
        password: hashedPassword,
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, config.jwtSecret),
    };
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return await prisma.mutation.updateUser({ data, where: { id: userId }}, info);
  },
  async deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    const userExists = await prisma.exists.User({ id: userId });

    if (!userExists) {
      throw new Error(`User with id ${userId} does not exist!`);
    }

    return prisma.mutation.deleteUser({ where: {
      id: userId,
    }}, info);
  },
  async createPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost({ data: {
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: {
        connect: {
          id: userId,
        },
      }
    } }, info);
  },
  async updatePost(parent, { postId, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: postId,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("You can't update the post you don't own.");
    }

    return prisma.mutation.updatePost({
      data,
      where: { id: postId },
    }, info);
  },
  async deletePost(parent, { postId }, { prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: postId,
      author: {
        id: userId,
      },
    });

    if (!postExists) {
      throw new Error("You can't delete the post you don't own.");
    }

    return prisma.mutation.deletePost({ where: { id: postId } }, info);
  },
  createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createComment({
      data: {
        text: data.text,
        author: {
          connect: {
            id: userId,
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
  async updateComment(parent, { commentId, data }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: commentId,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("You can't update the comment you don't own.");
    }
    return prisma.mutation.updateComment({
      data,
      where: {
        id: commentId,
      },
    }, info);
  },
  async deleteComment(parent, { commentId }, { prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: commentId,
      author: {
        id: userId,
      },
    });

    if (!commentExists) {
      throw new Error("You can't delete the comment you don't own.");
    }
    return prisma.mutation.deleteComment({
      where: {
        id: commentId,
      },
    }, info)
  },
  async login(parent, { data }, { prisma }, info) {
    const user = await prisma.query.user({ where: { email: data.email }});

    if (!user) {
      throw new Error('Unable to login!');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login!');
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, config.jwtSecret),
    };
  }
};
