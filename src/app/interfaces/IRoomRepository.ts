// Import necessary modules and interfaces
import { Room } from "../entities/Room";

/**
 * @interface IRoomRepository
 * This interface defines the methods that a RoomRepository should implement.
 */
export interface IRoomRepository {
    /**
     * Method to create a new room.
     * @param {Room} room - The room object to be created.
     * @returns {Promise<void>}
     */
    createRoom(room: Room): Promise<void>;

    /**
     * Method to check if a room exists by its number.
     * @param {string} room_number - The number of the room to be checked.
     * @returns {Promise<boolean>} - A promise that resolves to true if the room exists, false otherwise.
     */
    isRoomExistsByNumber(room_number: string): Promise<boolean>;

    /**
     * Method to check if rooms exists by ids.
     * @param {string[]} room_ids - An array of room ids to be validated.
     * @returns {Promise<boolean>} - A promise that resolves to true if all ids are valid, false otherwise.
     */
    isRoomIdsExists(room_ids: string[]): Promise<boolean>;

    /**
     * Method to get the total price of selected rooms by their ids.
     * @param {string[]} room_ids - An array of room ids.
     * @returns {Promise<number | null>} - A promise that resolves to the total price or null if any id is not valid.
     */
    getPriceBySelectedRoomIds(room_ids: string[]): Promise<number | null>;

    /**
     * Method to get room numbers based on their ids.
     * @param {string[]} room_ids - An array of room ids.
     * @returns {Promise<{ room_number: string }[] | null>} - A promise that resolves to an array of room numbers or null if any id is not valid.
     */
    getRoomsNumbersByRoomIds(room_ids: string[]): Promise<{ room_number: string }[] | null>;
};
