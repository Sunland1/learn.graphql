const store = require('../store/store.json')
const users = store.user

const resolversUser = {
    Query: {
      user(parent, args, context, info) {
        return users.find(user => user.id === args.id);
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
    }
};


module.exports = resolversUser