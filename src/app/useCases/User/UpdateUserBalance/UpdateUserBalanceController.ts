import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import { UpdateUserBalanceUseCase } from "./UpdateUserBalanceUseCase";
import UpdateUserBalanceRules from './UpdateUserBalanceValidationRules.json';

export class UpdateUserBalanceController {

    constructor(private updateUserBalanceUseCase: UpdateUserBalanceUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            const hasInvalidBody = ValidateBodyRequest(UpdateUserBalanceRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.updateUserBalanceUseCase.run({
                id: request.body.user_id,
                user_balance: request.body.user_balance
            });
            
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};