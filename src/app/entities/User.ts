/**
 * @fileoverview This module deals with the user management system.
 * 
 * @requires uuid: v4
 * @requires IUser from '../interfaces/IUser'
 */

import { v4 as uuid } from 'uuid';
import { IUser } from '../interfaces/IUser';

/**
 * @class
 * @implements {IUser}
 *
 * Class representing a User.
 */
export class User implements IUser {

    /**
     * @readonly
     * @type {string}
     * The unique identifier of the user.
     */
    public readonly id: string;

    /**
     * @type {string}
     * The name of the user.
     */
    public user_name: string;

    /**
     * @type {number}
     * The balance of the user's account.
     */
    public user_balance: number;

    /**
     * @type {string}
     * The email address of the user.
     */
    public email_address: string;
    
    /**
     * @type {string}
     * The password for the user's account.
     */
    public password: string;

    /**
     * Creates a new user.
     * @constructor
     * @param {Omit<User, 'id'>} props - The properties of the user.
     */
    constructor(props: Omit<User, 'id'>) {
        Object.assign(this, props);
        this.id = uuid();
    };
};
