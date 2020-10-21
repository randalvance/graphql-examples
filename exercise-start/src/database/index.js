import { Prisma } from 'prisma-binding';

export const database = new Prisma({
    typeDefs: 'src/database/prisma.graphql',
    endpoint: 'http://localhost:4466'
});
