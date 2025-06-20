const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./GraphQL/typeDefs');
const resolvers = require('./GraphQL/resolvers');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const DB =  require("./DB/db")
DB()

const app = express();
const port = process.env.PORT ;


// ✅ CORS should be applied to Express, not ApolloServer
app.use(cors({
  origin: "https://social-media-frontend-v07m.onrender.com",
  credentials: true,
}));

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app }); // Apollo middleware for /graphql

  app.get('/', (req, res) => {
    res.send('server is running....');
  });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
}

startServer();
