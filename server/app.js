const express = require("express");
const cors = require("cors");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const followersController = require("./controllers/followers-controller");
const fs = require("fs"); 
const path = require("path")
const multer = require("multer"); 

const server = express();
server.use(cors());
server.use(express.json());


const upload = multer({ dest: __dirname + "\\assets\\images" }); 
server.use(express.static(__dirname));
server.post("/upload-image", upload.any(), (request, response) => {
    const fileExtension = path.extname(request.files[0].originalname);
    const multerFilename = request.files[0].destination + "\\" + request.files[0].filename ;
    const finalFileName = multerFilename + fileExtension;
    fs.rename(multerFilename, finalFileName, err => {
        if (err) {
            response.status(500).json(err);
            return;
        }
        response.send(finalFileName);
    });
});
// ----------------------------------------------------------------------



server.use("/api/users/", usersController);
server.use("/api/vacations/", vacationsController);
server.use("/api/followers/", followersController);

server.listen(3001, console.log("Listening......"));
