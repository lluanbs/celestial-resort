import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import { CheckInReservationUseCase } from "./CheckInReservationUseCase";
import CheckInReservationRules from './CheckInReservationValidationRules.json';

export class CheckInReservationController {

    constructor(private checkInReservationUseCase: CheckInReservationUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            const hasInvalidBody = ValidateBodyRequest(CheckInReservationRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.checkInReservationUseCase.run({ id: request.body.reservation_id });
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};