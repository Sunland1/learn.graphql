//Store 
const fs = require('fs')
const store = require('../store/store.json')
const users = store.user


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
                email: args.input.email,
                password: args.input.password,
                lastName: args.input.lastName,
                firstName: args.input.firstName
            }
            users.push(user)
            saveStore("USER",users)
            return user
        },
    }
};


module.exports = resolversUser