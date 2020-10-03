import { GraphQLServer, PubSub } from "graphql-yoga";

import { db } from "./data/db";
import {
  Query,
  Mutation,
  Subscription,
  User,
  Post,
  Comment,
} from "./resolvers";

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    db,
    pubSub,
  },
});

server.start(() => {
  console.log("Server is running at port 4000!");
});
