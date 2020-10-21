import { Prisma } from 'prisma-binding';
import { fragmentReplacements } from './resolvers';

export const prisma = new Prisma({
    typeDefs: 'src/prisma.graphql',
    endpoint: 'http://localhost:4466',
    fragmentReplacements,
});
