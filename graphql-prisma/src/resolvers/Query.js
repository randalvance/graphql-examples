export const Query = {
    users(parent, args, { db, prisma }, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            };
        }

        return prisma.query.users(opArgs, info);
    },
    posts(parent, args, { db, prisma }, info) {
        const opArgs = {};

        if (args.query) {
            opArgs.where= {
                OR: [{
                     title_contains: args.query,
                }, {
                    body_contains: args.query,
                }],
            };
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parent, args, { db, prisma }, info) {
        return prisma.query.comments(null, info);
    },
    me(parent, args, { db }, info) {
        return {
            id: '123098',
            name: 'Randal',
            email: 'randal@randalvance.net',
        }
    },
};