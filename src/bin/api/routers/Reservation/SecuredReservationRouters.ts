import { Request, Response, Router } from "express";
import { checkInReservationController, confirmReservationController, createReservationController, downloadReservationController } from "../../../../app/useCases/Reservation";
import JWTValidation from "../../middleware/JWTValidation";
import multerErrorHandler from "../../middleware/MulterErrorHandler";
import upload from "../../MulterConfig";
export const securedReservationRouters = Router();

securedReservationRouters.post('/reservation', JWTValidation, (req, res) => createReservationController.handle(req, res));
securedReservationRouters.post('/reservation/verification',
    JWTValidation,
    upload.single('payment_receipt'),
    multerErrorHandler,
    (req: Request, res: Response) => confirmReservationController.handle(req, res)
);
securedReservationRouters.post('/reservation/download', JWTValidation, (req, res) => downloadReservationController.handle(req, res));
securedReservationRouters.post('/reservation/checkin',  (req, res) => checkInReservationController.handle(req, res));