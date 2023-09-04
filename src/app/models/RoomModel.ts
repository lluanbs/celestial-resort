/**
 * @fileoverview This file contains the RoomModel which is a Mongoose model for the Room entity.
 * @requires module:mongoose
 * @requires module:../entities/Room
 */

import mongoose, { Schema } from "mongoose";
import { Room } from "../entities/Room";

/**
 * @typedef {object} RoomSchema
 * @property {string} id - The room ID. Not required as MongoDB will auto-generate an _id field.
 * @property {string} room_number - The number of the room. Required.
 * @property {number} room_price - The price of the room per night. Required.
 */

const schema = new Schema<Room>(
    {
        id: { type: String, required: false },
        room_number: { type: String, required: true },
        room_price: { type: Number, required: true },
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
 * Creates an index on the `room_number` and `room_price` fields.
 */
schema.index({ room_number: 1, room_price: 1 });

/**
 * @typedef {mongoose.Model<Room>} RoomModel
 * @description Exports the Room model.
 */
export const RoomModel = mongoose.model<Room>("room", schema);
