import { Router } from "express";
import { defaultUserRouters } from "./DefaultUserRouters";
import { securedUserRouters } from "./SecuredUserRouters";
export const userRouters = Router();
userRouters.use(defaultUserRouters);
userRouters.use(securedUserRouters);