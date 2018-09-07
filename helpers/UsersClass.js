class Users{
    constructor(){
        this.users =[];
    }
    AddUserData(id,name,room){
        var users = {id,name,room};
        this.users.push(users);
        return users;
    }
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) =>user.id !== id);
        }
        return user;
    }

    GetUsersList(room){
        var users =this.users.filter((user)=> user.room === room); // ES6 shorthand
   /*var users here is a new array */
        var namesArray = users.map((user)=>{
            return user.name;
        });
        return namesArray;
    }

    GetUser(id){
        var getUser = this.users.filter((userId) =>{
            return userId.id===id;
        })[0];
        return getUser;
    }


}

module.exports = {Users};