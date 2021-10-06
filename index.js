const { ApolloServer} = require('apollo-server');
const GraphQLScalarType = require('graphql').GraphQLScalarType;


const typeDefs = require('./schemas')
const resolvers = require('./resolvers')


//Parse Date
const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
})


  


// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs,dateScalar,resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
