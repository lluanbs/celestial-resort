/**
 * @fileoverview This module deals with the user management system.
 */

/**
 * @interface
 *
 * Interface representing a User.
 */
export interface IUser {

    /**
     * @type {string}
     * The unique identifier of the user.
     */
    id: string;

    /**
     * @type {string}
     * The username chosen by the user.
     */
    user_name: string;

    /**
     * @type {number}
     * The current balance of the user's account.
     */
    user_balance: number;

    /**
     * @type {string}
     * The email address associated with the user's account.
     */
    email_address: string;

    /**
     * @type {string}
     * The password for the user's account. This should be stored securely and not displayed in plain text.
     */
    password: string;
};
