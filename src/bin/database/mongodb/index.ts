import mongoose from 'mongoose';
import CursorLog, { PrintLogType } from '../../utils/CursorLog';
import GetFileName from '../../utils/GetFileName';

/**
 * The MongoDatabase class is responsible for managing connections and settings with a MongoDB database.
 *
 * @class MongoDatabase
 */
export class MongoDatabase {
    /**
     * The mongoose instance used to connect and interact with the MongoDB database.
     * 
     * @private
     * @type {mongoose}
     */
    private db = mongoose;

    /**
     * Constructor method that initializes the connection and settings to the MongoDB database when an instance of MongoDatabase is created.
     */
    constructor() {
        this.run();
    };

    /**
     * Private method that establishes a connection to the MongoDB database.
     * Logs a success message once the connection is established, or an error message if the connection fails.
     * If the connection fails, it will attempt to reconnect every 2 seconds.
     * 
     * @private
     * @async
     */
    private async connect(): Promise<void> {
        const connectionOptions: mongoose.ConnectOptions = { dbName: process.env.MONGODB_DB_NAME! };

        try {
            await this.db.connect(process.env.MONGODB_URL!, connectionOptions);
            CursorLog(PrintLogType.SUCCESS, GetFileName(__filename), 'MongoDB Connected!');
        } catch (error) {
            const err = error as unknown as mongoose.MongooseError;
            CursorLog(PrintLogType.ERROR, GetFileName(__filename), `MongoDB Error: ${err.message}`);
            setTimeout(() => this.connect(), 2000);
        };
    };

    /**
     * Private method that sets the MongoDB database settings.
     * Sets strictQuery to false, debug to the value of MONGODB_DEBUG environment variable, and logs a warning message and attempts to reconnect every 5 seconds if the connection is lost.
     * 
     * @private
     */
    private settings(): void {
        this.db.set('strictQuery', false);
        this.db.set('debug', process.env.MONGODB_DEBUG === 'true');
        this.db.connection.on('disconnected', () => {
            CursorLog(PrintLogType.WARNING, GetFileName(__filename), 'MongoDB Disconnected! Trying to reconnect...');
            setTimeout(() => this.connect(), 5000);
        });
    };

    /**
     * Private method that runs the connect and settings methods.
     * This method is called in the constructor when an instance of MongoDatabase is created.
     * 
     * @private
     */
    private run(): void {
        this.connect();
        this.settings();
    };
};
