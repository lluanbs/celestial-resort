/**
 * @fileoverview This file contains the UserRepository class, which implements the IUserRepository interface.
 * It provides methods to interact with user data in the database.
 * @requires module:../entities/User
 * @requires module:../interfaces/IUser
 * @requires module:../interfaces/IUserRepository
 * @requires module:../models/UserModel
 */

import { User } from "../entities/User";
import { IUser } from "../interfaces/IUser";
import { IUserRepository } from "../interfaces/IUserRepository";
import { UserModel } from "../models/UserModel";

/**
 * @class
 * @classdesc UserRepository class implementing IUserRepository interface.
 */
export class UserRepository implements IUserRepository {
    /**
     * Create a new user.
     * @async
     * @param {User} user - The user object to be created.
     * @returns {Promise<void>}
     */
    public async createUser(user: User): Promise<void> {
        await UserModel.create(user);
    };

    /**
     * Update a user's name.
     * @async
     * @param {string} user_id - The ID of the user to update.
     * @param {string} user_name - The new name for the user.
     * @returns {Promise<void>}
     */
    public async updateUserName(user_id: string, user_name: string): Promise<void> {
        await UserModel.updateOne({ id: user_id }, { $set: { user_name: user_name } });
    };

    /**
     * Update a user's balance.
     * @async
     * @param {string} user_id - The ID of the user to update.
     * @param {number} user_balance - The new balance for the user.
     * @returns {Promise<void>}
     */
    public async updateUserBalance(user_id: string, user_balance: number): Promise<void> {
        await UserModel.updateOne({ id: user_id }, { $set: { user_balance: user_balance } });
    };

    /**
     * Check if a user exists by their ID.
     * @async
     * @param {string} user_id - The ID of the user to check.
     * @returns {Promise<boolean>} True if the user exists, false otherwise.
     */
    public async isUserExist(user_id: string): Promise<boolean> {
        return Boolean(await UserModel.findOne({ id: user_id }));
    };

    /**
     * Get user data by email address.
     * @async
     * @param {string} email_address - The email address of the user to retrieve.
     * @returns {Promise<IUser | null>} The user data if found, null otherwise.
     */
    public async getUserDataByEmail(email_address: string): Promise<IUser | null> {
        return await UserModel.findOne({ email_address });
    };

    /**
     * Get user data by ID.
     * @async
     * @param {string} user_id - The ID of the user to retrieve.
     * @returns {Promise<IUser | null>} The user data if found, null otherwise.
     */
    public async getUserDataById(user_id: string): Promise<IUser | null> {
        return await UserModel.findOne({ id: user_id });
    };

    /**
     * Decrease a user's balance.
     * @async
     * @param {string} user_id - The ID of the user to update.
     * @param {number} decrease_value - The amount by which to decrease the user's balance.
     * @returns {Promise<void>}
     */
    public async decreaseUserBalance(user_id: string, decrease_value: number): Promise<void> {
        await UserModel.updateOne({ id: user_id }, { $inc: { user_balance: -decrease_value } });
    };
};
