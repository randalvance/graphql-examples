export const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }
        return db.users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }
        return db.posts.filter(post => {
            const searchTerm = args.query.toLowerCase();
            const matchingTitle = post.title.toLowerCase().includes(searchTerm);
            const matchingBody = post.body.toLowerCase().includes(searchTerm);
            return matchingTitle || matchingBody;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    },
    me(parent, args, { db }, info) {
        return {
            id: '123098',
            name: 'Randal',
            email: 'randal@randalvance.net',
        }
    },
};