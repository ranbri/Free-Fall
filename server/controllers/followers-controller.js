const express = require("express")
const followersLogic = require("../bll/followers-logic");

const router = express.Router();

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const followers = await followersLogic.getOneFollowers(id);
        response.json(followers);
    }
    catch (error) {
        response.status(500).json(error.message);
    }
    

});

router.post("/", async (request, response) => {
    try {
        const follower = request.body;
        const addedfollower = await followersLogic.addFollower(follower);
        response.status(201).json(addedfollower);
    } catch (error) {
        response.status(500).json(error.message);
    }

});

router.put("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const follower = request.body;
        follower.id = id;
        const updatedFollower = await followersLogic.updateFollower(follower);
        response.json(updatedFollower);
    } catch (error) {
        response.status(500).json(error.message);
    }

});

router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const follower = request.body;
        follower.id = id;
        const updatedFollower = await followersLogic.updatePartialFollower(follower);
        response.json(updatedFollower);
    } catch (error) {
        response.status(500).json(error.message);
    }

})

router.delete("/", async (request, response) => {
    try {
        const follower = request.body;
        await followersLogic.deleteFollower(follower);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json(error.message);
    }

})
router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await followersLogic.deleteVacationFollow(id);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json(error.message);
    }

})
router.get("/", async (request, response) => {
    try {
        const followers = await followersLogic.getFollowerCount();
        response.json(followers);
    } catch (error) {
        response.status(500).json(error.message);
    }
})
module.exports = router;