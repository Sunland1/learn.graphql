const { ApolloServer, gql } = require('apollo-server');
const GraphQLScalarType = require('graphql').GraphQLScalarType;
const fs = require('fs')
const store = require('./store.json')


// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  scalar Date

  type User {
    id: Int
    email: String
    password: String
    firstName: String
    lastName: String
  }


  type Post {
      id: Int
      author: User
      comments: [Post]
      content: String
      createdAt: Date
      updatedAt: Date
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).

  input UserInput {
    id: Int
    email: String
    password: String
    firstName: String
    lastName: String
  }

  input PostInput {
      id: Int
      author: UserInput
      content: String
      createdAt: Date
      updatedAt: Date
  }

  type Query {
    user(id: Int): User
    post(id: Int = null) : [Post]
    comments( idPost: Int! ,idComment: Int = null) : [Post]
  }

  type Mutation {
    register(input: UserInput) : User
    createPost(input: PostInput , comments: PostInput = []) : Post
    updatePost(id: Int , input: PostInput , comments: PostInput = []) : Post
    deletePost(id: Int) : [Post]
    createPostComment(id: Int , input: PostInput) : Post
    updatePostComment(idPost: Int!,idComment: Int!,input: PostInput) : Post
    deletePostComment(idPost: Int! , idComment: Int!) : [Post]
  }
`;

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
})

//Acceess to the store
let users = store.user
let posts = store.post


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
      user(parent, args, context, info) {
        return users.find(user => user.id === args.id);
      },
      post(parent,args,context,info){
          if(args.id !== null){
            return [posts.find(post => post.id == args.id)]
          }
          return posts
      },
      comments(parents,args,context,info){
        const index = posts.findIndex(post => post.id === args.idPost)
        if(args.idComment !== null){
          const indexComment = posts[index].comments.findIndex(comment => comment.id === args.idComment)
          return [posts[index].comments[indexComment]]
        }
        return posts[index].comments
      }
    },
    Mutation: {
        register(parent,args,context,info) {
            const id = users.length
            const user = {
                id: id,
                email: args.email,
                password: args.password,
                lastName: args.lastName,
                firstName: args.firstName
            }
            users.push(user)
            saveStore("USER",users)
            return user
        },
        createPost(parent,args,context,info){
            const id = posts.length
            const post = {
                id: id,
                author: args.input.author,
                comments: args.comments,
                content: args.input.content,
                createdAt: args.input.createdAt,
                updatedAt: args.input.updatedAt
            }

            posts.push(post)
            saveStore("POST",posts)
            return post
        },

        updatePost(parents,args,context,info){
            const index = posts.findIndex(post => post.id == args.id)
            for(const property in posts[index]) {
                if(args.input[property] !== undefined){
                  posts[index][property] = args.input[property]
                } 
            }
            saveStore("POST",posts)
            return posts[index]
        },

        deletePost(parent,args,context,info){
            const index = posts.findIndex(post => post.id === args.id)
            posts.splice(index,1)
            saveStore("POST" , posts)
            return posts
        },

        createPostComment(parents,args,context,info){
          const index = posts.findIndex(post => post.id === args.id)
          posts[index].comments.push({
            id: posts[index].comments.length,
            author: args.input.author,
            content: args.input.content,
            createdAt: args.input.createdAt,
            updatedAt: args.input.updatedAt
          })

          saveStore("POST",posts)
          return posts[index]
        },

        updatePostComment(parents,args,context,info){
          const index = posts.findIndex(post => post.id === args.idPost)
          const indexComment = posts[index].comments.findIndex(comment=> comment.id === args.idComment)

          for(const property in posts[index].comments[indexComment]) {
            if(args.input[property] !== undefined){
              posts[index].comments[indexComment][property] = args.input[property]
            }
          }

          saveStore("POST" , posts)
          return posts[index].comments[indexComment]
        },

        deletePostComment(parents,args,context,info){
          const index = posts.findIndex(post => post.id === args.idPost)
          const indexComment = posts[index].comments.findIndex(comment=> comment.id === args.idComment)

          posts[index].comments.splice(indexComment,1)
          return posts[index].comments
        }
    }
};



function saveStore(type,new_tab){
    switch(type){
        case "USER" : 
            store.user = new_tab 
            break
        case "POST" : 
            store.post = new_tab
            break
    }
    fs.writeFileSync('./store.json' , JSON.stringify(store))
}
  







// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs,dateScalar,resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
