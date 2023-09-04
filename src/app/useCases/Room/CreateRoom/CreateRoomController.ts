import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import CreateRoomRules from './CreateRoomValidationRules.json';
import { CreateRoomUseCase } from "./CreateRoomUseCase";

export class CreateRoomController {

    constructor(private createRoomUseCase: CreateRoomUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            const hasInvalidBody = ValidateBodyRequest(CreateRoomRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.createRoomUseCase.run(request.body);
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};