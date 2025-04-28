import {Router} from "express";
import {ProgramController} from "../controllers/ProgramController";
import {requireBody, validate, validateSearchQuery} from "../middleware/inputValidation/baseValidator"
import {validateProgramData} from "../middleware/inputValidation/program";

const router = Router();
const controller = new ProgramController()

router.post("/", ...validateProgramData, validate, controller.createProgram.bind(controller))
router.get("/", controller.getAllPrograms.bind(controller))
router.get("/search", ...validateSearchQuery, validate, controller.searchPrograms.bind(controller)); //search program

router.route("/:id")
    .get(controller.getProgramById.bind(controller))
    .put(requireBody, controller.updateProgram.bind(controller))
    .delete(controller.deleteProgram.bind(controller))

export default router;