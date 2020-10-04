import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/prisma.graphql',
    endpoint: 'http://localhost:4466',
});

/*
prisma.query.users(null, `{
    id
    name
    email
    posts {
        id
        title
        body
    }
}`).then((result) => {
    console.log(JSON.stringify(result, null, 4));
});

prisma.query.comments(null, `{
    id
    text
    author {
        id
        name
    }
}`).then((result) => {
    console.log(JSON.stringify(result, null, 4));
});

prisma.mutation.createPost({
    data: {
        title: 'My New GraphQL Post is Live',
        body: 'You can find the new course here.',
        published: true,
        author: {
            connect: {
                id: 'ckfus90kr001g0793f80bj17s'
            }
        }
    }
}, `{
    id
    title
    body
    author {
        id
        name
    }
}`).then((result) => {
    console.log(JSON.stringify(result,null,4));
});

*/