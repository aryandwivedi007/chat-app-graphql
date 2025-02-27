

import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    active: Boolean
    role: String
  }

  type Message {
    id: ID!
    sender: User!
    receiver: User!
    content: String!
    createdAt: String!
  }

  type AuthPayload {
    accessToken: String!
    refreshToken: String!
  }

  type Query {
    getUsers: [User]!
    getUser(id: ID!): User
    getMessages(senderId: ID!, receiverId: ID!): [Message!]!
    getLoggedInUser: User!

  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String, active: Boolean, role: String): User!
    deleteUser(id: ID!): String!
    sendMessage(senderId: ID!, receiverId: ID!, content: String!): Message!
  }
`;

export default typeDefs;
