const express = require("express")
const vacationLogic = require("../bll/vacations-logic");
const multer = require("multer");

const upload = multer({ dest: "..\\assets\\images" });
const router = express.Router();


router.get("/", async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations();
        response.json(vacations);
    }
    catch (error) {
        response.status(500).json(error.message);
    }

});

router.get("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacations = await vacationLogic.getOneVacations(id);
        response.json(vacations);
    }
    catch (error) {
        response.status(500).json(error.message);
    }


});

router.post("/", upload.single("vacationImage"), async (request, response) => {
    try {
        const vacation = request.body;
        const addedVacation = await vacationLogic.addVacation(vacation);
        console.log(vacation.imageName)
        response.status(201).json(addedVacation);
    } catch (error) {
        response.status(500).json(error.message);
    }
});

router.patch("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = request.body;
        vacation.id = id;
        const updatedVacation = await vacationLogic.updatePartialVacation(vacation);
        response.json(updatedVacation);
    } catch (error) {
        response.status(500).json(error.message);
    }

})

router.delete("/:id", async (request, response) => {
    try {
        const id = +request.params.id;
        await vacationLogic.deleteVacation(id);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).json(error.message);
    }

})

module.exports = router;