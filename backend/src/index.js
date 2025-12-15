import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { getUserFromToken } from './auth/auth.js';
import { initializeUsers, initializeShipments } from './models/data.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

await initializeUsers();
initializeShipments();

const app = express();

// Create Apollo Server with performance optimizations
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      locations: error.locations,
      path: error.path,
    };
  },
  cache: 'bounded',
});

await server.start();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173','https://ultrashiptms-skilltest.vercel.app'],
    credentials: true,
  })
);

app.use(express.json());

app.use(
  '/graphql',
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token);

      return {
        user,
        headers: req.headers,
      };
    },
  })
);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════╗
  ║   🚀 UltraShip TMS Server is running!         ║
  ╠════════════════════════════════════════════════
  `);
});

export default app;
