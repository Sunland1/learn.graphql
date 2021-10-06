const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeUser = gql`
  
  type User {
    id: Int
    email: String
    password: String
    firstName: String
    lastName: String
  }

  input UserInput {
    id: Int
    email: String
    password: String
    firstName: String
    lastName: String
  }

  type Query {
    user(id: Int): User
  }

  type Mutation {
    register(input: UserInput) : User
  }
`;



module.exports = typeUser