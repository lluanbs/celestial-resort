import * as dotenvSafe from 'dotenv-safe';
import { APIServer } from './bin/api';
import { RedisClient } from './bin/cache/redis';
import { MongoDatabase } from './bin/database/mongodb';
dotenvSafe.config();
export const redis = new RedisClient();
new APIServer();
new MongoDatabase();