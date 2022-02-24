const dal = require("../dal/dal");

async function getAllUsers() {
    const sql = "select  * from users";
    const users = await dal.execute(sql);

    return users;
}

async function getOneUsers(userName) {
    const sql = `select userID, userName, firstName, lastName, password, if(isAdmin = 1, "true", "false") as isAdmin,
     if(isLogged = 1, "true", "false") as isLogged from users where userName = '${userName}' ` ;
    const users = await dal.execute(sql);

    return users[0];
}

async function addUser(user) {
    const sql = `insert into users(firstName,
    lastName, userName, password)
    values('${user.firstName}','${user.lastName}','${user.userName}','${user.password}')`;
    const info = await dal.execute(sql);

    user.id = info.insertId;
    return user;
}
async function updateUser(user) {
    const sql = `update users set isLogged = ${user.isLogged} WHERE userName = '${user.userName}'`;
    await dal.execute(sql);
}

async function deleteUser(id) {
    const sql = "delete from users where userID = " + id;
    await dal.execute(sql);
}

module.exports = {
    getAllUsers,
    getOneUsers,
    addUser,
    updateUser,
    deleteUser
};