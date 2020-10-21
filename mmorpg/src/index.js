import { GraphQLServer, PubSub } from "graphql-yoga";

import { prisma } from './prisma';
import {
  resolvers,
  fragmentReplacements
} from "./resolvers";

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  fragmentReplacements,
  context: (request) => {
    return {
      pubSub,
      prisma,
      request,
    };
  },
});

server.start({ port: 5555 }, () => {
  console.log("Server is running at port 5555!");
});
