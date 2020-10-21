export const Query = {
    servers(parent, args, { prisma }, info) {
        console.log('info', info);
        return prisma.query.servers();
    },
    items(parent, args, { prisma }, info) {
        const opArgs = {
            where: {
                name_contains: args.query,
            }
        };
        return prisma.query.items(opArgs, info);
    },
};