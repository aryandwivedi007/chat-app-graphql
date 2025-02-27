import { gql } from "@apollo/client";

// ✅ Get Messages Between Two Users
export const GET_MESSAGES = gql`
  query GetMessages($senderId: ID!, $receiverId: ID!) {
    getMessages(senderId: $senderId, receiverId: $receiverId) {
      id
      sender {
        name
        email
      }
      receiver {
        name
        email
      }
      content
      createdAt
    }
  }
`;
export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      name
      email
      role
      active
    }
  }
`;



export const GET_LOGGED_IN_USER = gql`
  query GetLoggedInUser {
    getLoggedInUser {
      id
      name
      email
      role
      active
    }
  }
`;