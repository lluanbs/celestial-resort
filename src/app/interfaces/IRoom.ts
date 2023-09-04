/**
 * @fileoverview This module deals with the room management system.
 */

/**
 * @interface
 *
 * Interface representing a Room.
 */
export interface IRoom {

    /**
     * @type {string}
     * The unique identifier of the room.
     */
    id: string;

    /**
     * @type {string}
     * The number assigned to the room.
     */
    room_number: string;

    /**
     * @type {number}
     * The price per night of the room.
     */
    room_price: number;
};
