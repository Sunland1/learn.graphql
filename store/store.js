const fs = require('fs')


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




module.exports = saveStore