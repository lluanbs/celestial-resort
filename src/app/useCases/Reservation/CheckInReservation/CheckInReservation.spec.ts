import express from 'express';
import request from 'supertest';
import { ReservationStatus } from '../../../interfaces/IReservation';
import { IReservationRepository } from '../../../interfaces/IReservationRepository';
import { IUserRepository } from '../../../interfaces/IUserRepository';
import { CheckInReservationController } from './CheckInReservationController';
import { CheckInReservationUseCase } from './CheckInReservationUseCase';

describe('CheckInReservationUseCase', () => {
    let useCase: CheckInReservationUseCase;
    let controller: CheckInReservationController;
    let mockReservationRepository: jest.Mocked<IReservationRepository>;
    let mockUserRepository: jest.Mocked<IUserRepository>;
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

        mockUserRepository = {
            isUserExist: jest.fn(),
            createUser: jest.fn(),
            decreaseUserBalance: jest.fn(),
            getUserDataByEmail: jest.fn(),
            getUserDataById: jest.fn(),
            updateUserBalance: jest.fn(),
            updateUserName: jest.fn(),
        };

        useCase = new CheckInReservationUseCase(mockReservationRepository, mockUserRepository);
        controller = new CheckInReservationController(useCase);

        app.post('/reservation/checkin', (req, res) => controller.handle(req, res));
    });

    it("should return error if reservation not found", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue(null);
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "Reservation not found!" });
    });

    it("should return error if reservation already used", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.COMPLETED });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "Reservation already used!" });
    });

    it("should return error if reservation already checked in", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.CHECKED_IN });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "Reservation already checked in!" });
    });

    it("should return error if reservation already checked out", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.CHECKED_OUT });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "Reservation already checked out!" });
    });

    it("should return error if payment for the reservation is rejected!", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.REJECTED });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "Reservation rejected!" });
    });

    it("should return error if user is not found", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.ACTIVE, user_id: "456" });
        (mockUserRepository.getUserDataById as jest.Mock).mockResolvedValue(null);
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "User not found!" });
    });

    it("should return error if user doesn't have enough balance", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ status: ReservationStatus.ACTIVE, user_id: "456", reservation_price: 1500 });
        (mockUserRepository.getUserDataById as jest.Mock).mockResolvedValue({ user_balance: 1000 });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 400, success: false, message: "User don't have enough cash balance!" });
    });

    it("should confirm check-in successfully", async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ id: "123", status: ReservationStatus.ACTIVE, user_id: "456", reservation_price: 1000 });
        (mockUserRepository.getUserDataById as jest.Mock).mockResolvedValue({ user_balance: 1500 });
        const response = await useCase.run({ id: "123" });
        expect(response).toEqual({ status: 200, success: true, message: "Check-in confirmed successfully" });
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .post('/reservation/checkin')
            .field('reservation_id', '');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        (mockReservationRepository.getReservation as jest.Mock).mockResolvedValue({ id: "123", status: ReservationStatus.ACTIVE, user_id: "456", reservation_price: 1000 });
        (mockUserRepository.getUserDataById as jest.Mock).mockResolvedValue({ user_balance: 1500 });
        const response = await request(app)
            .post('/reservation/checkin')
            .send({ reservation_id: "908299e9-9a25-45ca-8054-2eb8433357e5"});

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Check-in confirmed successfully");
    });
});