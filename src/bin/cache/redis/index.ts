import { createClient, RedisClientType } from "redis";
import CursorLog, { PrintLogType } from "../../utils/CursorLog";
import GetFileName from "../../utils/GetFileName";

/**
 * The RedisClient class is responsible for managing connections and operations with a Redis database.
 *
 * @class RedisClient
 */
export class RedisClient {

    /**
     * The Redis client instance used to connect and interact with the Redis database.
     * 
     * @private
     * @type {RedisClientType}
     */
    private client: RedisClientType = createClient({ url: process.env.REDIS_URL ?? 'redis://127.0.0.1:6379/0' });

    /**
     * Constructor method that initializes the connection to the Redis database when an instance of RedisClient is created.
     */
    constructor() {
        this.start();
    };

    /**
     * Private method that establishes a connection to the Redis database.
     * Logs a success message once the connection is established.
     * 
     * @private
     * @async
     */
    private async start() {
        await this.client.connect().then(() => CursorLog(PrintLogType.SUCCESS, GetFileName(__filename), 'Redis connection established!'));
    };

    /**
     * Method to find a value in the Redis database by its key.
     * Returns null if no result is found.
     *
     * @param {string} key - The key of the value to be found.
     * @returns {Promise<any>} The value associated with the key, or null if not found.
     * @public
     * @async
     */
    public async findOne(key: string): Promise<any> {
        const result = await this.client.get(key);
        if (!result) return null;
        return JSON.parse(result);
    };

    /**
     * Method to insert a value into the Redis database.
     * The value is stored as a stringified JSON.
     *
     * @param {string} key - The key to associate with the value.
     * @param {any} value - The value to be inserted.
     * @param {number} sec - The number of seconds after which the key should expire (default is 300).
     * @returns {Promise<void>}
     * @public
     * @async
     */
    public async insertOne(key: string, value: any, sec: number = 300) {
        const result = await this.client.set(key, JSON.stringify(value), { EX: sec })
        return result
    };

    /**
     * Method to delete a value in the Redis database by its key.
     *
     * @param {string} key - The key of the value to be deleted.
     * @returns {Promise<number>} The number of keys removed.
     * @public
     * @async
     */
    public async deleteOne(key: string) {
        const result = await this.client.del(key)
        return result
    };

    /**
     * Method to find a value by its key, replace it with a new value, and then return the new value.
     * If no value is found by the key, returns null.
     *
     * @param {string} key - The key of the value to be replaced.
     * @param {any} value - The new value.
     * @param {number} sec - The number of seconds after which the key should expire.
     * @returns {Promise<any>} The new value, or null if no value was found by the key.
     * @public
     * @async
     */
    public async findOneAndReplace(key: string, value: any, sec: number) {
        const result = await this.client.get(key);
        if (!result) return null;

        await this.deleteOne(key);
        await this.insertOne(key, value, sec);
        return await this.findOne(key);
    };
};