import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import AreUploadFilePresent from "../../../../bin/utils/AreUploadFilePresent";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import { ConfirmReservationUseCase } from "./ConfirmReservationUseCase";
import ConfirmReservationRules from './ConfirmReservationValidationRules.json';

export class ConfirmReservationController {

    constructor(private confirmReservationUseCase: ConfirmReservationUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            if (!await AreUploadFilePresent(false, request)) return ApiResponse.badRequest(response, 'Missing upload files!');
            const hasInvalidBody = ValidateBodyRequest(ConfirmReservationRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.confirmReservationUseCase.run({ id: request.body.reservation_id });
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};