import { Router } from "express";
import { ProgramController } from "../controllers/ProgramController";

const router = Router();
const controller = new ProgramController()
import { validate, requireBody } from "../middleware/inputValidation/baseValidator"
import { validateProgramData } from "../middleware/inputValidation/program";

router.post("/", ...validateProgramData, validate, controller.createProgram.bind(controller))
router.get("/", controller.getAllPrograms.bind(controller))
router.route("/:id")
    .get(controller.getProgramById.bind(controller))
    .put(requireBody, controller.updateProgram.bind(controller))
    .delete(controller.deleteProgram.bind(controller))

export default router;