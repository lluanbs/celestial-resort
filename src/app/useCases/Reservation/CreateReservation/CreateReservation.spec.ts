import express from 'express';
import request from 'supertest';
import { Reservation } from "../../../entities/Reservation";
import { ReservationStatus } from "../../../interfaces/IReservation";
import { IReservationRepository } from "../../../interfaces/IReservationRepository";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { RoomRepository } from "../../../repositories/RoomRepository";
import { CreateReservationController } from "./CreateReservationController";
import { CreateReservationUseCase } from "./CreateReservationUseCase";

describe('CreateReservationUseCase', () => {
    let useCase: CreateReservationUseCase;
    let controller: CreateReservationController;
    let mockReservationRepository: jest.Mocked<IReservationRepository>;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockRoomRepository: jest.Mocked<RoomRepository>;
    const app = express();
    app.use(express.json());

    beforeEach(() => {
        jest.resetAllMocks()
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

        mockRoomRepository = {
            isRoomIdsExists: jest.fn(),
            getPriceBySelectedRoomIds: jest.fn(),
            getRoomsNumbersByRoomIds: jest.fn(),
            createRoom: jest.fn(),
            isRoomExistsByNumber: jest.fn(),
        };

        useCase = new CreateReservationUseCase(mockReservationRepository, mockUserRepository, mockRoomRepository);
        controller = new CreateReservationController(useCase);

        app.post('/reservation', (req, res) => controller.handle(req, res));
    });

    it('should return error if user does not exist', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(false));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("User not exists!");
    });

    it('should return error if rooms does not exists', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(false));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Invalid rooms IDs!");
    });

    it('should return error if rooms are not available for reservation', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(true));
        mockReservationRepository.isRoomsOccupied.mockImplementation(() => Promise.resolve(true));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Rooms not available!");
    });

    it('should return error if there is not price for reserved room', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(true));
        mockReservationRepository.isRoomsOccupied.mockImplementation(() => Promise.resolve(false));
        mockRoomRepository.getPriceBySelectedRoomIds.mockImplementation(() => Promise.resolve(0));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Rooms prices not available!");
    });

    it('should return error if there no numbers for rooms ids', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(true));
        mockReservationRepository.isRoomsOccupied.mockImplementation(() => Promise.resolve(false));
        mockRoomRepository.getPriceBySelectedRoomIds.mockImplementation(() => Promise.resolve(50));
        mockRoomRepository.getRoomsNumbersByRoomIds.mockImplementation(() => Promise.resolve(null));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(response.status).toBe(400);
        expect(response.message).toBe("Rooms numbers not available!");
    });

    it('should return success if reservation is created', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(true));
        mockReservationRepository.isRoomsOccupied.mockImplementation(() => Promise.resolve(false));
        mockRoomRepository.getPriceBySelectedRoomIds.mockImplementation(() => Promise.resolve(50));
        mockRoomRepository.getRoomsNumbersByRoomIds.mockImplementation(() => Promise.resolve([{ room_number: "10" }]));

        mockReservationRepository.createReservation.mockImplementation((reservation: Reservation) => Promise.resolve({
            ...reservation,
            id: "a2f16737-56df-43fc-80c3-74fa4e3a410a",
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
        } as Reservation));

        const response = await useCase.run({
            user_id: "4ce4ff53-bbbd-4b0c-846f-5b5630fd0aab",
            rooms: ["room1", "room2"],
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
            reservation_price: 0,
            status: ReservationStatus.PENDING
        });

        expect(mockReservationRepository.createReservation).toHaveBeenCalled();

        const calledWithArg = mockReservationRepository.createReservation.mock.calls[0][0];

        expect(calledWithArg).toBeInstanceOf(Reservation);
        expect(calledWithArg.status).toBe(ReservationStatus.PENDING);
        expect(calledWithArg.reservation_price).toBe(50);

        expect(response.status).toBe(200);
        expect(response.message).toBe("Reservation created successfully!");
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app).post('/reservation').send({
            user_id: "",
            user_name: "",
            rooms: ["room1", "room2"],
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00"
        });

        expect(response.status).toBe(400);
    });

    it('should return 200 for valid body', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(true));
        mockRoomRepository.isRoomIdsExists.mockImplementation(() => Promise.resolve(true));
        mockReservationRepository.isRoomsOccupied.mockImplementation(() => Promise.resolve(false));
        mockRoomRepository.getPriceBySelectedRoomIds.mockImplementation(() => Promise.resolve(50));
        mockRoomRepository.getRoomsNumbersByRoomIds.mockImplementation(() => Promise.resolve([{ room_number: "10" }]));

        mockReservationRepository.createReservation.mockImplementation((reservation: Reservation) => Promise.resolve({
            ...reservation,
            id: "a2f16737-56df-43fc-80c3-74fa4e3a410a",
            user_name: "Luiz",
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00",
        } as Reservation));
        
        const response = await request(app).post('/reservation').send({
            user_id: "5bfad936-8c36-4803-9167-f9484c509531",
            user_name: "Luiz",
            rooms: [
                "abeaa01d-46bc-47a3-bccc-e9e87079bdfe",
                "320839f8-dd34-472c-91bc-2948b9b372db"
            ],
            check_in_date: "12/11/1997 12:00:00",
            check_out_date: "12/11/1997 13:00:00"

        });

        expect(response.status).toBe(200);
    });
});