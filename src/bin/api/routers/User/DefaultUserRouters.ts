import { Router } from "express";
import { authenticateUserController, createUserController } from "../../../../app/useCases/User";
export const defaultUserRouters = Router();
defaultUserRouters.post('/user/authenticate', (req, res) => authenticateUserController.handle(req, res));
defaultUserRouters.post('/user/account', (req, res) => createUserController.handle(req, res));