const dal = require("../dal/dal");
const fs = require("fs"); // File System
const path = require("path"); // ביצוע פעולות הקשורות לנתיבים של קבצים ותיקיות
const multer = require("multer"); // ספריה לשמירת קבצים בצד השרת
const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());



//--------------------------------------------------------------------------------------------

async function getAllVacations() {//✓
    const sql = "select vacationID ,location ," +
        "description,imageName, begin, end, price from vacations";
    const vacations = await dal.execute(sql);

    return vacations;
}

async function getOneVacations(id) {//✓
    const sql = "select vacationID ,location ,imageName, " +
    "description, begin, end, price from vacations where vacationID =" + id;
    const vacations = await dal.execute(sql);

    return vacations[0];
}

async function addVacation(vacation) {//✓
    const sql = `insert into vacations(imageName, location, 
    description, begin, end, price)
    values('${vacation.imageName}', '${vacation.location}','${vacation.description}','${vacation.begin}',
    '${vacation.end}',${vacation.price})`;
    const info = await dal.execute(sql);
    vacation.id = info.insertId;
    return vacation;
}

async function updateVacation(vacation) {
    const sql = `update vacations set imageName = '${vacation.imageName}' ,location = '${vacation.location}', description = '${vacation.description}',
     price = '${vacation.price}', begin = '${vacation.begin}', end = '${vacation.end}' where vacationid = ${vacation.id}`;
    await dal.execute(sql);
    return vacation;
}

async function updatePartialVacation(vacation) {
    const sql = `update vacations set imageName = '${vacation.imageName}', location = '${vacation.location}', description = '${vacation.description}', price = '${vacation.price}', begin = '${vacation.begin}',
    end = '${vacation.end}' where vacationid = ${vacation.id}`;
    await dal.execute(sql);
    return vacation;
}

async function deleteVacation(id) { //✓
    const sql = "delete from vacations where vacationID = " + id;
    await dal.execute(sql);
}

module.exports = {
    getAllVacations,
    getOneVacations,
    addVacation, 
    updateVacation,
    updatePartialVacation,
    deleteVacation
};