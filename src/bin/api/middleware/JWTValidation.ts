import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { ApiResponse } from "../../utils/ApiResponse";
import CursorLog, { PrintLogType } from "../../utils/CursorLog";
import GetFileName from "../../utils/GetFileName";

export default async (req: Request, res: Response, next: NextFunction) => {
    const secret = process.env.API_KEY;
    const issuer = process.env.API_KEY_REFRESH_DAYS;
    const audience = process.env.API_AUDIENCE;

    try {
        if (!secret || !issuer || !audience) return ApiResponse.internalServerError(res, 'Missing JWT config validation!');
        const headerJwtToken = req.headers.authorization;
        if (!headerJwtToken) return ApiResponse.unauthorized(res, 'Authorization header JWT Token missing!');
        const [_, token] = headerJwtToken.split(" ");
        verify(token, secret), { issuer, audience };
        return next();
    } catch (error) {
        CursorLog(PrintLogType.ERROR, GetFileName(__filename), error);
        return ApiResponse.badRequest(res, 'It seems that the JWT token is invalid or expired!');
    };
};