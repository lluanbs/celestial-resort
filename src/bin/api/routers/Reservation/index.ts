import { Router } from "express";
import { defaultReservationRouters } from "./DefaultReservationRouters";
import { securedReservationRouters } from "./SecuredReservationRouters";
export const reservationRouters = Router();
reservationRouters.use(defaultReservationRouters);
reservationRouters.use(securedReservationRouters);