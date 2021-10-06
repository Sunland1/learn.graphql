const store = require('../store/store.json')
const posts = store.post
const resolversPost = {
    Query: {
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



module.exports = resolversPost