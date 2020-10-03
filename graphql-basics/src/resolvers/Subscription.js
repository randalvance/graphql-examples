export const Subscription = {
  count: {
    subscribe(parent, args, { pubSub }, info) {
        let count = 0;

        setInterval(() => {
            count++;
            pubSub.publish('count', {
                count,
            });
        }, 1000);

        return pubSub.asyncIterator('count');
    },
  },
  comment: {
      subscribe(parent, { postId }, { db, pubSub }, info) {
        const post = db.posts.find(p => p.id === postId && p.published);

        if (!post) {
            throw new Error(`Published post with ID ${postId} does not exist!`);
        }

        return pubSub.asyncIterator(`comments of post ${postId}`);
      }
  }
};
