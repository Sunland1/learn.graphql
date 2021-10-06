const {gql} = require('apollo-server');
const GraphQLScalarType = require('graphql').GraphQLScalarType;

const typePost = gql`

  scalar Date

  type Post {
      id: Int
      author: User
      comments: [Post]
      content: String
      createdAt: Date
      updatedAt: Date
  }


  input PostInput {
      id: Int
      author: UserInput
      content: String
      createdAt: Date
      updatedAt: Date
  }

  type Query {
    post(id: Int = null) : [Post]
    comments( idPost: Int! ,idComment: Int = null) : [Post]
  }

  type Mutation {
    createPost(input: PostInput , comments: PostInput = []) : Post
    updatePost(id: Int , input: PostInput , comments: PostInput = []) : Post
    deletePost(id: Int) : [Post]
    createPostComment(id: Int , input: PostInput) : Post
    updatePostComment(idPost: Int!,idComment: Int!,input: PostInput) : Post
    deletePostComment(idPost: Int! , idComment: Int!) : [Post]
  }
`;

module.exports = typePost