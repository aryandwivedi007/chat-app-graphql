import { gql } from "@apollo/client";

// ✅ Register a new user
export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      id
      name
      email
      active
      role
    }
  }
`;

// ✅ Login User
export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

// ✅ Update User
export const UPDATE_USER = gql`
  mutation UpdateUser($id: String!, $name: String, $email: String, $active: Boolean, $role: String) {
    updateUser(id: $id, name: $name, email: $email, active: $active, role: $role) {
      id
      name
      email
      active
      role
    }
  }
`;

// ✅ Delete User (Admin Only)
export const DELETE_USER = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

// ✅ Send Message
// export const SEND_MESSAGE = gql`
//   mutation SendMessage($senderId: String!, $receiverId: String!, $content: String!) {
//     sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content) {
//       id
//       sender { name }
//       receiver { name }
//       content
//       createdAt
//     }
//   }
// `;
export const SEND_MESSAGE = gql`
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $content: String!) {
    sendMessage(senderId: $senderId, receiverId: $receiverId, content: $content) {
      id
      content
      createdAt
      sender {
        name
      }
      receiver {
        name
      }
    }
  }
`;