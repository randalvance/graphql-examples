import { v4 as uuid } from "uuid";

export const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(
      (u) => u.email.toLowerCase() === args.data.email.toLowerCase()
    );

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
  updateUser(parent, { userId, data }, { db }, info) {
    const user = db.users.find((u) => u.id === userId);

    if (!user) {
      throw new Error(`User with ID ${userId} does not exist!`);
    }

    if (typeof data.email === "string") {
      const isEmailTaken = db.users.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase()
      );

      if (isEmailTaken) {
        throw new Error(`Email ${data.email} is already registered!`);
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },
  deleteUser(parent, args, { db }, info) {
    const { userId } = args;
    const userToDelete = db.users.find((u) => u.id === userId);

    if (!userToDelete) {
      throw new Error(`User with id ${userId} does not exist!`);
    }

    db.users = db.users.filter((u) => u.id !== userId);
    db.posts = db.posts.filter((post) => {
      const match = post.author === userId;

      if (match) {
        comments = db.comments.filter((c) => c.post === post.id);
      }

      return !match;
    });
    db.comments = db.comments.filter((c) => c.author !== userId);

    return userToDelete;
  },
  createPost(parent, args, { db, pubSub }, info) {
    const { title, body, published, authorId } = args.data;

    const userExists = db.users.some((u) => u.id === authorId);

    if (!userExists) {
      throw new Error(`User with id ${authorId} does not exist!`);
    }

    const post = {
      id: uuid(),
      title,
      body,
      published,
      author: authorId,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubSub.publish("posts", {
        post: {
          mutation: 'CREATED',
          data: post,
        }
      });
    }

    return post;
  },
  updatePost(parent, { postId, data }, { pubSub, db }, info) {
    const post = db.posts.find((p) => p.id === postId);

    if (!post) {
      throw new Error(`Post with id ${postId} does not exist!`);
    }

    const originalPost = { ...post };

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubSub.publish('posts', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          },
        });
      } else if (!originalPost.published && post.published) {
        pubSub.publish('posts', {
          post: {
            mutation: 'CREATED',
            data: post,
          }
        });
      }
    } else if (post.published) {
      pubSub.publish('posts', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { pubSub, db }, info) {
    const { postId } = args;
    const postIndex = db.posts.findIndex((p) => p.id === postId);

    if (postIndex === -1) {
      throw new Error(`Post with ID ${postId} does not exist!`);
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== postId);

    if (deletedPost.published) {
      pubSub.publish('posts',  {
        post: {
          mutation: 'DELETED',
          data: deletedPost,
        }
      })
    }

    return deletedPost;
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
