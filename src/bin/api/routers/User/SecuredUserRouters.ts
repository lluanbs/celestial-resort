import { Router } from "express";
import JWTValidation from "../../middleware/JWTValidation";
import { updateUserBalanceController } from "../../../../app/useCases/User";
export const securedUserRouters = Router();
securedUserRouters.patch('/user/balance', JWTValidation, (req, res) => updateUserBalanceController.handle(req, res));