import { GraphQLServer } from 'graphql-yoga';

const server = new GraphQLServer();

server.start({ port: 5555 }, () => {
  console.log('');
});
