import { Router } from "express";
import { defaultRoomRouters } from "./DefaultRoomRouters";
import { securedRoomRouters } from "./SecuredRoomRouters";
export const roomRouters = Router();
roomRouters.use(defaultRoomRouters);
roomRouters.use(securedRoomRouters);