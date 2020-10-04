export const Post = {
    author(parent, args, { db }, info) {
        const authorId = parent.author;
        return db.users.find(u => u.id === authorId);
    },
    comments(parent, args, { db }, info) {
        const postId = parent.id;
        return db.comments.filter(c => c.post === postId);
    }
};