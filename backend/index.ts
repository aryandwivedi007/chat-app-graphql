
// import { ApolloServer } from "@apollo/server";
// import { startStandaloneServer } from "@apollo/server/standalone";
// import typeDefs from "./app/graphql/typeDefs";
// import resolvers from "./app/graphql/resolvers";
// import { loadConfig } from "./app/common/helper/config.hepler";
// import { initDB } from "./app/common/services/database.service";
// import { initPassport } from "./app/common/services/passport-jwt.service";
// import { type IUser } from "./app/user/user.dto";
// import jwt from "jsonwebtoken";
// import User from "./app/user/user.schema"; // Mongoose User Model

// loadConfig();

// const port = Number(process.env.PORT) || 5000;


// const getUserFromToken = async (token?: string) => {
//  // console.log(token)
//   if (!token) return null;
//   console.log(process.env.JWT_ACCESS_SECRET)
//   try {
//     console.log("UP Here")
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "");
//     console.log("Here",decoded)
//   //   const {email}=decoded.email
//   //  const decodedUser=User.findById(decoded.email)
//     return decoded
//   } catch {
//     return null;
//   }
// };


// const initApp = async (): Promise<void> => {
//   await initDB();
//   initPassport();

//   const server = new ApolloServer({
//     typeDefs,
//     resolvers,
//   });

//   const { url } = await startStandaloneServer(server, {
//     listen: { port },
//     context: async ({ req }) => {
//       const token = req.headers.authorization
//       //console.log(token)
//       const user = await getUserFromToken(token);
//       console.log("user here",user)
//       return { user };
//     },
//   });

//   console.log(`🚀 GraphQL Server is running at ${url}`);
// };

// void initApp();

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import http from "http";
import typeDefs from "./app/graphql/typeDefs";
import resolvers from "./app/graphql/resolvers";
import { loadConfig } from "./app/common/helper/config.hepler";
import { initDB } from "./app/common/services/database.service";
import jwt from "jsonwebtoken";
import User from "./app/user/user.schema"; // Mongoose User Model

loadConfig();

const port = Number(process.env.PORT) || 5000;

const getUserFromToken = async (token?: string) => {
  if (!token) return null;

  try {
    console.log("JWT_SECRET:", process.env.JWT_ACCESS_SECRET);
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_ACCESS_SECRET ?? "");
    console.log("Decoded User:", decoded);
    return decoded;
  } catch (error) {
    console.error("JWT Verification Failed:");
    return null;
  }
};

const initApp = async (): Promise<void> => {
  await initDB();

  const app = express();
  const httpServer = http.createServer(app);

  // ✅ Enable CORS
  app.use(
    cors({
      origin: "*", // ✅ Allow all origins (change in production)
      methods: ["GET", "POST", "OPTIONS"], // ✅ Allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
    })
  );

  // ✅ Initialize Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();
  app.use("/graphql", express.json(), expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization;
      const user = await getUserFromToken(token);
      console.log("Authenticated User:", user);
      return { user };
    },
  }));

  httpServer.listen(port, () => {
    console.log(`🚀 GraphQL Server is running at http://localhost:${port}/graphql`);
  });
};

void initApp();
