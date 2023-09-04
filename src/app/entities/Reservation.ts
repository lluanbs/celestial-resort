/**
 * @fileoverview This module deals with the reservation system.
 * 
 * @requires uuid: v4
 * @requires DateConvertToIso from '../../bin/utils/DateConvertToIso'
 * @requires IReservation, ReservationStatus from '../interfaces/IReservation'
 */

import { v4 as uuid } from 'uuid';
import DateConvertToIso from '../../bin/utils/DateConvertToIso';
import { IReservation, ReservationStatus } from '../interfaces/IReservation';

/**
 * @class
 * @implements {IReservation}
 *
 * Class representing a reservation.
 */
export class Reservation implements IReservation {

    /**
     * @readonly
     * @type {string}
     * The unique identifier of the reservation.
     */
    public readonly id: string;

    /**
     * @type {string}
     * The unique identifier of the user who made the reservation.
     */
    public user_id: string;

    /**
     * @type {string}
     * The name of the user who made the reservation.
     */
    public user_name: string;

    /**
     * @type {string[]}
     * The rooms reserved.
     */
    public rooms: string[];

    /**
     * @type {string}
     * The check-in date for the reservation.
     */
    public check_in_date: string;

    /**
     * @type {string}
     * The check-out date for the reservation.
     */
    public check_out_date: string;

    /**
     * @type {number}
     * The total price of the reservation.
     */
    public reservation_price: number;

    /**
     * @type {ReservationStatus}
     * The status of the reservation.
     */
    public status: ReservationStatus;

    /**
     * Creates a new reservation.
     * @constructor
     * @param {Omit<Reservation, 'id'>} props - The properties of the reservation.
     */
    constructor(props: Omit<Reservation, 'id'>) {
        Object.assign(this, props);
        this.id = uuid();
        this.check_in_date = DateConvertToIso(props.check_in_date);
        this.check_out_date = DateConvertToIso(props.check_out_date);
    };
};
