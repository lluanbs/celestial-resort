/**
 * @fileoverview This module deals with the generation of JWT access tokens.
 */

import jwt from "jsonwebtoken";

/**
 * Function to generate a JWT access token.
 *
 * @param {string} userId - The unique identifier of the user.
 * @returns {Object} An object containing the access token and its expiration time.
 * @throws Will throw an error if any of the environment variables are not set.
 */
export default (userId: string) => {

    /**
     * @type {string}
     * The secret key used for signing the JWT.
     */
    const secret = process.env.API_KEY;

    /**
     * @type {string}
     * The duration that the JWT is valid for, in seconds.
     */
    const expiresIn = process.env.API_KEY_EXPIRE_IN_SEC;

    /**
     * @type {string}
     * The issuer of the JWT.
     */
    const issuer = process.env.API_KEY_REFRESH_DAYS;

    /**
     * @type {string}
     * The intended audience of the JWT.
     */
    const audience = process.env.API_AUDIENCE;

    if (!secret || !expiresIn || !issuer || !audience) throw new Error('Missing secrets!');
    
    /**
     * @type {string}
     * The generated JWT access token.
     */
    const accessToken = jwt.sign({ key: userId }, secret, { subject: userId, issuer, audience, expiresIn });

    return { accessToken, expiresIn };
};
