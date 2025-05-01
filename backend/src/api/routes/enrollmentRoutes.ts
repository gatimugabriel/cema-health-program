import { Router } from "express";
import { EnrollmentController } from "../controllers/EnrollmentController";
import { validate, requireBody } from "../middleware/inputValidation/baseValidator";
import { validateEnrollmentData, validateEnrollmentUpdateData } from "../middleware/inputValidation/enrollment";
import {authenticate} from "../middleware/auth.middleware";

const router = Router();
const controller = new EnrollmentController();

router.use(authenticate) //all routes here require auth

router.post("/", ...validateEnrollmentData, validate, controller.createEnrollment.bind(controller)); //enroll
router.get("/client/:clientId", controller.getEnrollmentsByClientId.bind(controller)); //get client enrollments
router.get("/program/:programId", controller.getEnrollmentsByProgramId.bind(controller)); //get program enrollments
router.get("/", controller.getAllEnrollments.bind(controller));

router.route("/:id")
    .get(controller.getById.bind(controller))
    .put(requireBody, ...validateEnrollmentUpdateData, validate, controller.updateEnrollment.bind(controller))
    .delete(controller.deleteEnrollment.bind(controller));

export default router;