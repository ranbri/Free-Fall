const dal = require("../dal/dal");


async function getFollowerCount() {
    const sql = `SELECT COUNT(f.userID) as followers, v.location as location FROM followers f,
     vacations v WHERE v.vacationID = f.vacationID GROUP BY v.vacationID`
    return await dal.execute(sql);
}
async function getAllFollowers() {
    const sql = "select userID , vacationID from followers";
    const followers = await dal.execute(sql);

    return followers;
}

async function getOneFollowers(id) {
    const sql = `SELECT vacationID FROM followers WHERE userID = ${id}`;
    const followers = await dal.execute(sql);

    return followers;
}

async function addFollower(follower) {
    const sql = `insert into followers(vacationID, userID)
    values('${follower.vacationID}','${follower.userID}')`;
    const info = await dal.execute(sql);

    follower.id = info.insertId;
    return follower;
}

async function updateFollower(follower) {
    const sql = `update followers set followername = '${follower.name}', 
    unitprice = ${follower.price}, unitsinstock = ${follower.stock} where followerid = ${follower.id}`;
    await dal.execute(sql);
    return follower;
}

async function deleteFollower(follower) {
    const sql = `delete from followers where vacationID = ${follower.vacationID} and userID = ${follower.userID}`;
    await dal.execute(sql);
}
async function deleteVacationFollow(vacationID) {
    const sql = `delete from followers where vacationID = ${vacationID}`;
    await dal.execute(sql);
}

module.exports = {
    getAllFollowers,
    getOneFollowers,
    addFollower,
    updateFollower,
    deleteFollower,
    getFollowerCount,
    deleteVacationFollow
};