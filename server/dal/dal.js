const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port:'8889',
    user: "root",
    password: "root",
    database: "vacations"
});

connection.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("We're connected to MySQL");
});


function execute(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
}

module.exports = { execute };