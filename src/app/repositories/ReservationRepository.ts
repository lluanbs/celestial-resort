/**
 * @fileoverview This file contains the ReservationRepository class, which implements the IReservationRepository interface.
 * It provides methods to interact with reservation data in the database.
 * @requires module:../entities/Reservation
 * @requires module:../interfaces/IReservation
 * @requires module:../interfaces/IReservationRepository
 * @requires module:../models/ReservationModel
 */

import { Reservation } from "../entities/Reservation";
import { ReservationStatus } from "../interfaces/IReservation";
import { IReservationRepository } from "../interfaces/IReservationRepository";
import { ReservationModel } from "../models/ReservationModel";

/**
 * @class
 * @classdesc ReservationRepository class implementing IReservationRepository interface.
 */
export class ReservationRepository implements IReservationRepository {
    /**
     * Create a new reservation.
     * @async
     * @param {Reservation} reservation - The reservation object to be created.
     * @returns {Promise<Reservation>} The created reservation object.
     */
    public async createReservation(reservation: Reservation): Promise<Reservation> {
        return await ReservationModel.create(reservation);
    };

    /**
     * Check if rooms are available for reservation.
     * Reservated
     * @async
     * @param {string[]} rooms - An array of room IDs to check availability.
     * @returns {Promise<boolean>} True if all rooms are available, false otherwise.
     */
    public async isRoomsOccupied(rooms: string[]): Promise<boolean> {
        const hasOccupiedRoom = (await ReservationModel.find({
            $and: [
                { rooms: { $in: rooms } },
                { status: { $in: [ReservationStatus.ACTIVE, ReservationStatus.PENDING, ReservationStatus.CHECKED_IN, ReservationStatus.CHECKED_OUT] } }
            ]
        })).length;
        if (hasOccupiedRoom > 0) return true;
        return false;
    };

    /**
     * Update the status of a reservation.
     * @async
     * @param {string} reservation_id - The ID of the reservation to update.
     * @param {ReservationStatus} status - The new status to set.
     * @returns {Promise<void>}
     */
    public async updateReservationStatus(reservation_id: string, status: ReservationStatus): Promise<void> {
        await ReservationModel.updateOne({ id: reservation_id }, { $set: { status: status } });
    };

    /**
     * Get a reservation by its ID.
     * @async
     * @param {string} reservation_id - The ID of the reservation to retrieve.
     * @returns {Promise<Reservation | null>} The reservation object if found, null otherwise.
     */
    public async getReservation(reservation_id: string): Promise<Reservation | null> {
        return await ReservationModel.findOne({ id: reservation_id });
    };
};
