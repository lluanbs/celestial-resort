// Import necessary modules and interfaces
import { Reservation } from "../entities/Reservation";
import { ReservationStatus } from "./IReservation";

/**
 * @interface IReservationRepository
 * This interface defines the methods that a ReservationRepository should implement.
 */
export interface IReservationRepository {
    /**
     * Method to create a new reservation.
     * @param {Reservation} reservation - The reservation object to be created.
     * @returns {Promise<Reservation>} - A promise that resolves to the created reservation.
     */
    createReservation(reservation: Reservation): Promise<Reservation>;

    /**
     * Method to check if rooms are available.
     * @param {string[]} rooms - An array of room ids to be checked.
     * @returns {Promise<boolean>} - A promise that resolves to true if rooms are available, false otherwise.
     */
    isRoomsOccupied(rooms: string[]): Promise<boolean>;

    /**
     * Method to update the status of a reservation.
     * @param {string} reservation_id - The id of the reservation to be updated.
     * @param {ReservationStatus} status - The new status of the reservation.
     * @returns {Promise<void>}
     */
    updateReservationStatus(reservation_id: string, status: ReservationStatus): Promise<void>;

    /**
     * Method to get a reservation by its id.
     * @param {string} reservation_id - The id of the reservation to be fetched.
     * @returns {Promise<Reservation | null>} - A promise that resolves to the found reservation or null if not found.
     */
    getReservation(reservation_id: string): Promise<Reservation | null>;
};
