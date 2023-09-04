/**
 * @fileoverview This module deals with the reservation management system.
 */

/**
 * @interface
 *
 * Interface representing a Reservation.
 */
export interface IReservation {

    /**
     * @type {string}
     * The unique identifier of the reservation.
     */
    id: string;

    /**
     * @type {string}
     * The user ID linked to the reservation.
     */
    user_id: string;

    /**
     * @type {string}
     * The name of the user linked to the reservation.
     */
    user_name: string;

    /**
     * @type {string[]}
     * Array containing the rooms reserved by the user.
     */
    rooms: string[];

    /**
     * @type {string}
     * The check-in date for the reservation.
     */
    check_in_date: string;

    /**
     * @type {string}
     * The check-out date for the reservation.
     */
    check_out_date: string;

    /**
     * @type {number}
     * The total price of the reservation.
     */
    reservation_price: number;
    
    /**
     * @type {ReservationStatus}
     * The current status of the reservation.
     */
    status: ReservationStatus;
};

/**
 * @enum {string}
 * 
 * Enumeration representing the possible states of a reservation.
 */
export enum ReservationStatus {
    /**
     * Indicates that the reservation is currently active.
     */
    ACTIVE = 'ACTIVE',

    /**
     * Indicates that the reservation is currently pending approval.
     */
    PENDING = 'PENDING',

    /**
     * Indicates that the reservation has been completed.
     */
    COMPLETED = 'COMPLETED',

    /**
     * Indicates that the reservation has been rejected.
     */
    REJECTED = 'REJECTED',

    /**
     * Indicates that the guest has checked into the property.
     */
    CHECKED_IN = 'CHECKED_IN',

    /**
     * Indicates that the guest has checked out from the property.
     */
    CHECKED_OUT = 'CHECKED_OUT'
};