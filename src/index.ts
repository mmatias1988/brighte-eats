import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { leadTypeDefs, leadResolvers } from './modules/leads/index.js';

/**
 * Combined GraphQL schema
 * Includes health check query merged with lead schema
 */
const typeDefs = `#graphql
  ${leadTypeDefs}

  extend type Query {
    health: String
  }
`;

/**
 * Combined GraphQL resolvers
 */
const resolvers = {
  Query: {
    health: () => 'OK',
    ...leadResolvers.Query,
  },
  Mutation: {
    ...leadResolvers.Mutation,
  },
  DateTime: leadResolvers.DateTime,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`GraphQL Playground available at ${url}`);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});