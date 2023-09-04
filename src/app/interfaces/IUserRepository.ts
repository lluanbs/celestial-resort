// Import necessary modules and interfaces
import { User } from "../entities/User";
import { IUser } from "./IUser";

/**
 * @interface IUserRepository
 * This interface defines the methods that a UserRepository should implement.
 */
export interface IUserRepository {
    /**
     * Method to create a new user.
     * @param {User} user - The user object to be created.
     * @returns {Promise<void>}
     */
    createUser(user: User): Promise<void>;

    /**
     * Method to update a user's name.
     * @param {string} user_id - The id of the user to be updated.
     * @param {string} user_name - The new name for the user.
     * @returns {Promise<void>}
     */
    updateUserName(user_id: string, user_name: string): Promise<void>;

    /**
     * Method to update a user's balance.
     * @param {string} user_id - The id of the user to be updated.
     * @param {number} user_balance - The new balance for the user.
     * @returns {Promise<void>}
     */
    updateUserBalance(user_id: string, user_balance: number): Promise<void>;

    /**
     * Method to check if a user exists by their id.
     * @param {string} user_id - The id of the user to be checked.
     * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
     */
    isUserExist(user_id: string): Promise<boolean>;

    /**
     * Method to get a user's data by their email address.
     * @param {string} email_address - The email address of the user.
     * @returns {Promise<IUser | null>} - A promise that resolves to the user data or null if the user does not exist.
     */
    getUserDataByEmail(email_address: string): Promise<IUser | null>;

    /**
     * Method to get a user's data by their id.
     * @param {string} user_id - The id of the user.
     * @returns {Promise<IUser | null>} - A promise that resolves to the user data or null if the user does not exist.
     */
    getUserDataById(user_id: string): Promise<IUser | null>;

    /**
     * Method to decrease a user's balance.
     * @param {string} user_id - The id of the user.
     * @param {number} decrease_value - The amount to decrease from the user's balance.
     * @returns {Promise<void>}
     */
    decreaseUserBalance(user_id: string, decrease_value: number): Promise<void>;
};
