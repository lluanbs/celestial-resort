import multer from 'multer';
import { ApiResponse } from '../../utils/ApiResponse';

export default (error: { message: any; }, req: any, res: any, next: () => void) => {
    if (error instanceof multer.MulterError || error) return ApiResponse.badRequest(res, error.message);
    return next();
};