import cors from 'cors';
import express, { Express } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import CursorLog, { PrintLogType } from '../utils/CursorLog';
import GetFileName from '../utils/GetFileName';
import { mainRouters } from './routers';

export class APIServer {

    private app: Express = express();
    private limiter: RateLimitRequestHandler = rateLimit(
        {
            windowMs: 15 * 60 * 1000,
            max: 100,
            legacyHeaders: false,
        }
    );

    constructor() {
        this.run();
    };

    private run(): void {
        this.security();
        this.routers();
        this.handler();
    };

    private routers(): void {
        this.app.use(mainRouters);
    };

    private security(): void {
        this.app.use(express.urlencoded({ limit: process.env.API_JSON_LIMIT || '50mb', extended: true }));
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json({ limit: process.env.API_JSON_LIMIT || '50mb' }));
        this.app.use(morgan('dev'));
        this.app.use(this.limiter);
    };

    private async handler(): Promise<void> {
        const port = process.env.PORT_LISTENER;
        this.app.listen(port, () => CursorLog(PrintLogType.SUCCESS, GetFileName(__filename), `Running on port -> ${port}`));
    };
};