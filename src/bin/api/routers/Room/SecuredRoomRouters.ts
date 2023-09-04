import { Router } from "express";
import { createRoomController } from "../../../../app/useCases/Room";
import JWTValidation from "../../middleware/JWTValidation";
export const securedRoomRouters = Router();
securedRoomRouters.post('/room', JWTValidation, (req, res) => createRoomController.handle(req, res));