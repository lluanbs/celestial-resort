/**
 * @fileoverview This file contains the ReservationModel which is a Mongoose model for the Reservation entity.
 * @requires module:mongoose
 * @requires module:../entities/Reservation
 */

import mongoose, { Schema } from "mongoose";
import { Reservation } from "../entities/Reservation";

/**
 * @typedef {object} ReservationSchema
 * @property {string} id - The reservation ID. Not required as MongoDB will auto-generate an _id field.
 * @property {string} user_id - The ID of the user who made the reservation. Required.
 * @property {string} user_name - The name of the user who made the reservation. Required.
 * @property {string} check_in_date - The check-in date for the reservation. Required.
 * @property {string} check_out_date - The check-out date for the reservation. Required.
 * @property {Schema.Types.Mixed} rooms - The rooms reserved. Required.
 * @property {number} reservation_price - The total price of the reservation. Required.
 * @property {string} status - The status of the reservation. Required.
 */

const schema = new Schema<Reservation>(
    {
        id: { type: String, required: false },
        user_id: { type: String, required: true },
        user_name: { type: String, required: true },
        check_in_date: { type: String, required: true },
        check_out_date: { type: String, required: true },
        rooms: { type: Schema.Types.Mixed, required: true },
        reservation_price: { type: Number, required: true },
        status: { type: String, required: true }
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
 * Creates an index on the `user_id`, `user_name` and `rooms` fields.
 */
schema.index({ user_id: 1, user_name: 1, rooms: 1 });

/**
 * @typedef {mongoose.Model<Reservation>} ReservationModel
 * @description Exports the Reservation model.
 */
export const ReservationModel = mongoose.model<Reservation>("reservation", schema);
