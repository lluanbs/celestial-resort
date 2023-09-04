/**
 * @fileoverview This module deals with the room management system.
 * 
 * @requires uuid: v4
 * @requires IRoom from '../interfaces/IRoom'
 */

import { v4 as uuid } from 'uuid';
import { IRoom } from '../interfaces/IRoom';

/**
 * @class
 * @implements {IRoom}
 *
 * Class representing a room.
 */
export class Room implements IRoom {

    /**
     * @readonly
     * @type {string}
     * The unique identifier of the room.
     */
    public readonly id: string;

    /**
     * @type {string}
     * The number of the room.
     */
    public room_number: string;

    /**
     * @type {number}
     * The price of the room.
     */
    public room_price: number;

    /**
     * Creates a new room.
     * @constructor
     * @param {Omit<Room, 'id' | 'version'>} props - The properties of the room.
     */
    constructor(props: Omit<Room, 'id' | 'version'>) {
        Object.assign(this, props);
        this.id = uuid();
    };
};
