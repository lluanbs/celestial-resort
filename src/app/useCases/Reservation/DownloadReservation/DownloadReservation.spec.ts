import express from 'express';
import request from 'supertest';
import SearchDirectoryPath from '../../../../bin/utils/SearchDirectoryPath';
import { IReservationRepository } from '../../../interfaces/IReservationRepository';
import { DownloadReservationController } from './DownloadReservationController';
import { DownloadReservationUseCase } from './DownloadReservationUseCase';

jest.mock('../../../../bin/utils/SearchDirectoryPath', () => jest.fn());

describe('DownloadReservationUseCase', () => {
    let useCase: DownloadReservationUseCase;
    let controller: DownloadReservationController;
    let mockReservationRepository: jest.Mocked<IReservationRepository>;
    const app = express();
    app.use(express.json());

    beforeEach(() => {
        jest.resetAllMocks();
        mockReservationRepository = {
            isRoomsOccupied: jest.fn(),
            createReservation: jest.fn(),
            getReservation: jest.fn(),
            updateReservationStatus: jest.fn(),
        };

        useCase = new DownloadReservationUseCase(mockReservationRepository);
        controller = new DownloadReservationController(useCase);

        app.post('/reservation/download', (req, res) => controller.handle(req, res));
    });


    it("should return error if reservation confirmation not found", async () => {
        (SearchDirectoryPath as jest.Mock).mockImplementation(() => null);
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: true, message: "Reservation confirmation not found!" });
    });

    it("should return success if reservation confirmation is found", async () => {
        (SearchDirectoryPath as jest.Mock).mockImplementation(() => "./download/318007bd-f5f1-410b-a56e-308e158e933a.pdf");
        const response = await useCase.run({ id: "123" });
        expect(response.status).toBe(200);
        expect(response.message).toBe('Reservation downloaded successfully!');
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .post('/reservation/download')
            .field('reservation_id', '');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        (SearchDirectoryPath as jest.Mock).mockImplementation(() => "./download/318007bd-f5f1-410b-a56e-308e158e933a.pdf");
        const response = await request(app)
            .post('/reservation/download')
            .send({ reservation_id: "908299e9-9a25-45ca-8054-2eb8433357e5" });

        expect(response.status).toBe(200);
    });
});