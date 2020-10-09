import { Prisma } from 'prisma-binding';

export const prisma = new Prisma({
    typeDefs: 'src/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: 'mysecret',
});
