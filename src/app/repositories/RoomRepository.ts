/**
 * @fileoverview This file contains the RoomRepository class, which implements the IRoomRepository interface.
 * It provides methods to interact with room data in the database.
 * @requires module:../entities/Room
 * @requires module:../interfaces/IRoomRepository
 * @requires module:../models/RoomModel
 */

import { Room } from "../entities/Room";
import { IRoomRepository } from "../interfaces/IRoomRepository";
import { RoomModel } from "../models/RoomModel";

/**
 * @class
 * @classdesc RoomRepository class implementing IRoomRepository interface.
 */
export class RoomRepository implements IRoomRepository {
    /**
     * Create a new room.
     * @async
     * @param {Room} room - The room object to be created.
     * @returns {Promise<void>}
     */
    public async createRoom(room: Room): Promise<void> {
        await RoomModel.create(room);
    };

    /**
     * Check if a room exists by its number.
     * @async
     * @param {string} room_number - The number of the room to check.
     * @returns {Promise<boolean>} True if the room exists, false otherwise.
     */
    public async isRoomExistsByNumber(room_number: string): Promise<boolean> {
        return Boolean(await RoomModel.findOne({ room_number }));
    };

    /**
     * Check if rooms exist by ids.
     * @async
     * @param {string[]} room_ids - An array of room IDs to validate.
     * @returns {Promise<boolean>} True if all room IDs are valid, false otherwise.
     */
    public async isRoomIdsExists(room_ids: string[]): Promise<boolean> {
        const foundRooms = await RoomModel.find({ id: { $in: room_ids } });
        return foundRooms.length === room_ids.length;
    };

    /**
     * Get total price for selected rooms.
     * @async
     * @param {string[]} room_ids - An array of room IDs to get the total price.
     * @returns {Promise<number | null>} The total price of the rooms if found, null otherwise.
     */
    public async getPriceBySelectedRoomIds(room_ids: string[]): Promise<number | null> {
        const rooms = await RoomModel.find({ id: { $in: room_ids } }, { room_price: 1 });
        let sumRoom = 0;
        for (const room of rooms) {
            sumRoom += room.room_price;
        };
        return sumRoom;
    };

    /**
     * Get room numbers by their IDs.
     * @async
     * @param {string[]} room_ids - An array of room IDs to get the room numbers.
     * @returns {Promise<{ room_number: string }[] | null>} An array of room numbers if found, null otherwise.
     */
    public async getRoomsNumbersByRoomIds(room_ids: string[]): Promise<{ room_number: string }[] | null> {
        return await RoomModel.find({ id: { $in: room_ids } }, { _id: 0, room_number: 1 });
    };
};
