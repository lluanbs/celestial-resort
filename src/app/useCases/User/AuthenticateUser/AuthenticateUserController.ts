import { Request, Response } from "express";
import { ApiResponse } from "../../../../bin/utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../../../bin/utils/CursorLog";
import GetFileName from "../../../../bin/utils/GetFileName";
import ValidateBodyRequest from '../../../../bin/utils/ValidateBodyRequest';
import AuthenticateUserRules from './AuthenticateUserValidationRules.json';
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

export class AuthenticateUserController {

    constructor(private authenticateUserUseCase: AuthenticateUserUseCase) { };

    public async handle(request: Request, response: Response) {
        try {
            const hasInvalidBody = ValidateBodyRequest(AuthenticateUserRules, request.body);
            if (hasInvalidBody) return ApiResponse.badRequest(response, 'Some fields are invalid!', hasInvalidBody);

            const useCaseResponse = await this.authenticateUserUseCase.run(request.body);
            return ApiResponse.custom(response, useCaseResponse.status, useCaseResponse.success, useCaseResponse.message, useCaseResponse.data);
        } catch (error) {
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
            return ApiResponse.internalServerError(response);
        };
    };
};