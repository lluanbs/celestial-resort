import { Response } from 'express';

/**
 * @class ApiResponse
 * @description This class provides a set of static methods to generate standard HTTP responses.
 */
export class ApiResponse {

  /**
   * @method custom
   * @static
   * @param {Response} res - Express response object.
   * @param {number} statusCode - HTTP status code.
   * @param {boolean} [success=true] - Indicates whether the operation was successful or not.
   * @param {string} [message='Success'] - Message to be sent in the response.
   * @param {any} [data=null] - Data to be sent in the response.
   * @returns {Response} Express response object with the status and JSON payload.
   */
  public static custom(res: Response, statusCode: number, success: boolean = true, message: string = 'Success', data: any = null): Response {
    return res.status(statusCode).json({
      success,
      message,
      data,
    });
  }

  // The following methods are similar to the `custom` method but they have predefined status codes and success values.

  /**
   * @method success
   * @static
   * @description Generates a success (200) response.
   */
  public static success(res: Response, message: string = 'Success', data: any = null): Response {
    return this.custom(res, 200, true, message, data);
  }

  /**
   * @method created
   * @static
   * @description Generates a created (201) response.
   */
  public static created(res: Response, message: string = 'Created', data: any = null): Response {
    return this.custom(res, 201, true, message, data);
  }

  /**
   * @method badRequest
   * @static
   * @description Generates a bad request (400) response.
   */
  public static badRequest(res: Response, message: string = 'Bad Request', data: any = null): Response {
    return this.custom(res, 400, false, message, data);
  }

  /**
   * @method unauthorized
   * @static
   * @description Generates an unauthorized (401) response.
   */
  public static unauthorized(res: Response, message: string = 'Unauthorized', data: any = null): Response {
    return this.custom(res, 401, false, message, data);
  }

  /**
   * @method forbidden
   * @static
   * @description Generates a forbidden (403) response.
   */
  public static forbidden(res: Response, message: string = 'Forbidden', data: any = null): Response {
    return this.custom(res, 403, false, message, data);
  }

  /**
   * @method notFound
   * @static
   * @description Generates a not found (404) response.
   */
  public static notFound(res: Response, message: string = 'Not Found', data: any = null): Response {
    return this.custom(res, 404, false, message, data);
  }

  /**
   * @method internalServerError
   * @static
   * @description Generates an internal server error (500) response.
   */
  public static internalServerError(res: Response, message: string = 'Internal Server Error', data: any = null): Response {
    return this.custom(res, 500, false, message, data);
  }

  /**
   * @method download
   * @static
   * @description Generates a response that initiates file download.
   * @param {Response} res - Express response object.
   * @param {any} data - Path to the file to be downloaded.
   * @returns {Response} Express response object with the status and download initiated.
   */
  public static download(res: Response, data: any) {
    return res.status(200).download(data);
  };
};