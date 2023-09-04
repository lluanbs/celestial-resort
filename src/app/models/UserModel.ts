/**
 * @fileoverview This file contains the UserModel which is a Mongoose model for the User entity.
 * @requires module:mongoose
 * @requires module:../entities/User
 */

import mongoose, { Schema } from "mongoose";
import { User } from "../entities/User";

/**
 * @typedef {object} UserSchema
 * @property {string} id - The user ID. Not required as MongoDB will auto-generate an _id field.
 * @property {string} user_name - The name of the user. Required.
 * @property {number} user_balance - The balance of the user. Required and defaults to 0 if not provided.
 * @property {string} email_address - The email address of the user. Required.
 * @property {string} password - The password of the user. Required.
 */

const schema = new Schema<User>(
    {
        id: { type: String, required: false },
        user_name: { type: String, required: true },
        user_balance: { type: Number, required: true, default: 0 },
        email_address: { type: String, required: true },
        password: { type: String, required: true }
    },
    {
        toJSON: {
            transform: (_, ret): void => {
                ret._id = ret._id;
                delete ret._id;
                delete ret.__v;
                delete ret.createdAt;
                delete ret.updatedAt;
            },
        },
        timestamps: true,
    });

/**
 * Creates an index on the `id` and `user_name` fields.
 */
schema.index({ id: 1, user_name: 1 });

/**
 * @typedef {mongoose.Model<User>} UserModel
 * @description Exports the User model.
 */
export const UserModel = mongoose.model<User>("user", schema);
