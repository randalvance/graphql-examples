export const Comment = {
    author(parent, args, { db }, info) {
        return db.users.find(u => u.id === parent.author);
    },
    post(parent, args, { db }, info) {
        return db.posts.find(p => p.id === parent.post);
    }
};