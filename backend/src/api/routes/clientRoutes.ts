import { Router } from "express";
import { ClientController } from "../controllers/ClientController";
import { validate, requireBody } from "../middleware/inputValidation/baseValidator";
import { validateClientData, validateClientUpdateData, validateClientSearchQuery } from "../middleware/inputValidation/client";

const router = Router();
const controller = new ClientController();

router.post("/", ...validateClientData, validate, controller.createClient.bind(controller)); //new client
router.get("/", controller.getAllClients.bind(controller)); // get all
router.get("/search", ...validateClientSearchQuery, validate, controller.searchClients.bind(controller)); //search client
router.get("/identification/:idNumber", controller.getClientByIdentificationNumber.bind(controller)); // get by identification number

// Get, update, & delete  by ID
router.route("/:id")
    .get(controller.getClientById.bind(controller))
    .patch(requireBody, ...validateClientUpdateData, validate, controller.updateClient.bind(controller))
    .delete(controller.deleteClient.bind(controller));

export default router;