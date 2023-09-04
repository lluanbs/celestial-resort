import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import { DownloadReservationUseCase } from "./DownloadReservationUseCase";
import DownloadReservationRules from './DownloadReservationValidationRules.json';

export class DownloadReservationController {

    constructor(private downloadReservationUseCase: DownloadReservationUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            const hasInvalidBody = ValidateBodyRequest(DownloadReservationRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.downloadReservationUseCase.run({ id: request.body.reservation_id });
            if (useCaseResponse.status === 200) return ApiResponse.download(response, useCaseResponse.data);
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message, useCaseResponse.data);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};