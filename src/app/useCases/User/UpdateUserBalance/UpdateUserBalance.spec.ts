import express from 'express';
import request from 'supertest';
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { UpdateUserBalanceController } from './UpdateUserBalanceController';
import { UpdateUserBalanceUseCase } from './UpdateUserBalanceUseCase';

describe('UpdateUserBalanceUseCase', () => {
    let useCase: UpdateUserBalanceUseCase;
    let controller: UpdateUserBalanceController;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    const app = express();
    app.use(express.json());

    beforeEach(() => {
        jest.resetAllMocks();

        mockUserRepository = {
            isUserExist: jest.fn(),
            updateUserBalance: jest.fn(),
            decreaseUserBalance: jest.fn(),
            getUserDataByEmail: jest.fn(),
            getUserDataById: jest.fn(),
            createUser: jest.fn(),
            updateUserName: jest.fn(),
        };

        useCase = new UpdateUserBalanceUseCase(mockUserRepository);
        controller = new UpdateUserBalanceController(useCase);

        app.patch('/user/balance', (req, res) => controller.handle(req, res));
    });

    it('should return 400 if user does not exist', async () => {
        mockUserRepository.getUserDataById.mockResolvedValueOnce(null);

        const result = await useCase.run({ id: '9be04690-1743-4aa8-a78b-a28b49a4b241', user_balance: 5000 });
        expect(result).toEqual({ status: 400, success: false, message: "User not found!" });
    });

    it('should return 200 if user exists and balance is updated', async () => {
        mockUserRepository.getUserDataById.mockResolvedValueOnce({
            id: '9be04690-1743-4aa8-a78b-a28b49a4b241',
            user_name: 'John Doe',
            email_address: 'johndoe@example.com',
            password: 'hashed_password',
            user_balance: 5000
        });
        mockUserRepository.updateUserBalance.mockResolvedValueOnce();

        const result = await useCase.run({ id: 'existing_id', user_balance: 5000 });
        expect(result).toEqual({ status: 200, success: true, message: "User balance successfully updated!" });
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .patch('/user/balance')
            .send({
                user_id: "6af54316-0ca9-4dd8-89a7-7a398cfad45d",
                user_balance: ''
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        mockUserRepository.getUserDataById.mockResolvedValueOnce({
            id: '6af54316-0ca9-4dd8-89a7-7a398cfad45d',
            user_name: 'John Doe',
            email_address: 'johndoe@example.com',
            password: 'hashed_password',
            user_balance: 5000
        });
        mockUserRepository.updateUserBalance.mockResolvedValueOnce();

        const response = await request(app)
            .patch('/user/balance')
            .send({
                user_id: "6af54316-0ca9-4dd8-89a7-7a398cfad45d",
                user_balance: 60
            });
        mockUserRepository.updateUserBalance.mockResolvedValueOnce();
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User balance successfully updated!");
    });

});