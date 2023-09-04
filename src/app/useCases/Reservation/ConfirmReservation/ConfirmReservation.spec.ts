import express from 'express';
import fs from 'mz/fs';
import request from 'supertest';
import { ReservationStatus } from '../../../interfaces/IReservation';
import { IReservationRepository } from '../../../interfaces/IReservationRepository';
import { ConfirmReservationController } from './ConfirmReservationController';
import { ConfirmReservationUseCase } from './ConfirmReservationUseCase';

describe('ConfirmReservationUseCase', () => {
    let useCase: ConfirmReservationUseCase;
    let controller: ConfirmReservationController;
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

        useCase = new ConfirmReservationUseCase(mockReservationRepository);
        controller = new ConfirmReservationController(useCase);

        app.post('/reservation/verification', (req, res) => controller.handle(req, res));
    });

    it("should return error if reservation is not found", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue(null);

        const result = await useCase.run({ id: '123' });

        expect(result).toEqual({ status: 400, success: false, message: "Reservation not found!" });
    });

    it("should return success if reservation is already active", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.ACTIVE });

        const result = await useCase.run({ id: '123' });

        expect(result).toEqual({ status: 200, success: true, message: "Reservation already confirmed!" });
    });

    it("should confirm the reservation if it is not active", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.PENDING });
        (mockReservationRepository.updateReservationStatus as jest.Mock).mockResolvedValue(true);

        const result = await useCase.run({ id: '123' });

        expect(result).toEqual({ status: 200, success: true, message: "Reservation confirmed successfully!" });
        expect(mockReservationRepository.updateReservationStatus).toHaveBeenCalledWith('123', ReservationStatus.ACTIVE);
    });

    it("should return bad request if upload files are missing", async () => {
        const response = await request(app)
            .post('/reservation/verification')
            .field('reservation_id', '123')
            .attach('payment_receipt', '');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Missing upload files!');
    });

    // it('should return 400 for invalid body', async () => {
    //     const filePath = './uploads/1693193419977.pdf';
    
    //     // Test if the test file exists
    //     const exists = await fs.access(filePath);  // Use fs.promises para uma versão Promise do fs
    
    //     // Se o arquivo existe, continue o teste
    //     const res = await request(app)
    //         .post('/reservation/verification')
    //         .attach('payment_receipt', filePath);
        
    //     const { success, message, filePath: responseFilePath } = res.body;
        
    //     console.log(message); // Isso não deve causar um erro agora
    
    //     expect(success).toBeTruthy();
    //     expect(message).toBe('Uploaded successfully');
    //     expect(typeof responseFilePath).toBeTruthy();
    // });
});