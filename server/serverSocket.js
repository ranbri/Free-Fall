const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const vacationLogic = require("./bll/vacations-logic");

const server = express();
server.use(cors());
server.use(express.json());
const httpServer = http.createServer(server).listen(3002, console.log("Socket Is On"));
const socketServer = socketIO.listen(httpServer);


const allSockets = [];
socketServer.sockets.on("connection", socket => {
    allSockets.push(socket);
    console.log("One client has been connected... Total clients: " + allSockets.length);


    socket.on("update-all", async () => {
        socketServer.sockets.emit("admin-made-changes", await vacationLogic.getAllVacations());
    })


    socket.on("disconnect", () => {
        allSockets.splice(allSockets.indexOf(socket), 1); // Remove that client.
        console.log("One client has been disconnected. Total clients: " + allSockets.length);
    });

});