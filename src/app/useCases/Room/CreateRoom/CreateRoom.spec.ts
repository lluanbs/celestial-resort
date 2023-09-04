import express from 'express';
import request from 'supertest';
import { IRoomRepository } from '../../../interfaces/IRoomRepository';
import { CreateRoomController } from './CreateRoomController';
import { CreateRoomUseCase } from './CreateRoomUseCase';

describe('CreateRoomUseCase', () => {
    let useCase: CreateRoomUseCase;
    let controller: CreateRoomController;
    let mockRoomRepository: jest.Mocked<IRoomRepository>;
    const app = express();
    app.use(express.json());

    beforeEach(() => {
        jest.resetAllMocks();
        mockRoomRepository = {
            createRoom: jest.fn(),
            getPriceBySelectedRoomIds: jest.fn(),
            getRoomsNumbersByRoomIds: jest.fn(),
            isRoomExistsByNumber: jest.fn(),
            isRoomIdsExists: jest.fn(),
        };

        useCase = new CreateRoomUseCase(mockRoomRepository);
        controller = new CreateRoomController(useCase);

        app.post('/room', (req, res) => controller.handle(req, res));
    });

    it("should return error if room already exists", async () => {
        (mockRoomRepository.isRoomExistsByNumber as jest.Mock).mockResolvedValue(true);
        const response = await useCase.run({ room_price: 1, room_number: "101" });
        expect(response).toEqual({ status: 400, success: false, message: "Room already exists!" });
    });

    it("should return success if room does not exist", async () => {
        (mockRoomRepository.isRoomExistsByNumber as jest.Mock).mockResolvedValue(false);
        const response = await useCase.run({ room_price: 1, room_number: "101" });
        expect(response).toEqual({ status: 200, success: true, message: "Room created successfully!" });

        expect(mockRoomRepository.createRoom).toBeCalledWith(
            expect.objectContaining({
                room_price: 1,
                room_number: "101"
            })
        );
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .post('/room')
            .field('room_number', '')
            .field('room_price', '');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        (mockRoomRepository.isRoomExistsByNumber as jest.Mock).mockResolvedValue(false);
        const response = await request(app)
            .post('/room')
            .send({
                room_number: "101",
                room_price: 60,
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Room created successfully!");
    });
});