import { GraphQLServer, PubSub } from "graphql-yoga";

import { prisma } from './prisma';
import { db } from "./data/db";
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
      db,
      pubSub,
      prisma,
      request,
    };
  },
});

server.start(() => {
  console.log("Server is running at port 4000!");
});
