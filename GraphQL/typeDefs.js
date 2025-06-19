const { gql } = require('apollo-server-express');;

const typeDefs = gql`
 type User {
  id: ID!
  name: String!
  email: String!
  phone: String!
  password: String!
  otp: Int!
  createTime: String!     
  otpExpiryTime: String! 
  token: String
}

  type Mutation {
   registerUser(name: String!, email: String!, password: String!, phone: String!): User
    login(email: String!, password: String!): User
    changePassword(email: String!, oldPassword: String!, newPassword: String!): String
  }

  type Query {
    users: [User]
  }
`;

module.exports = typeDefs;
