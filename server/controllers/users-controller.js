const express = require("express")
const userLogic = require("../bll/users-logic");

const router = express.Router();

router.get("/", async (request, response) => {
    try {
        const users = await userLogic.getAllUsers();
        response.json(users);
    }
    catch (error) {
        response.status(500).json(error.message);
    }

});

router.get("/:userName", async (request, response) => {
    try {
        const userName = request.params.userName;
        const users = await userLogic.getOneUsers(userName);
        response.json(users);
    }
    catch (error) {
        response.status(500).json(error.message);
    }


});

router.post("/", async (request, response) => {
    try {
        const user = request.body;
        const addedUser = await userLogic.addUser(user);
        response.status(201).json(addedUser);
    } catch (error) {
        response.status(500).json(error.message);
    }

});

router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const user = request.body;
        user.id = id;
        const updatedUser = await userLogic.updateUser(user);
        response.json(updatedUser);
    } catch (error) {
        response.status(500).json(error.message);
    }

});

router.patch("/", async (request, response) => {
    try {
        const user = request.body;
        await userLogic.updateUser(user);
        response.sendStatus(200);
    } catch (error) {
        response.status(500).json(error.message);
    }

})

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await userLogic.deleteUser(id);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json(error.message);
    }

})

module.exports = router;