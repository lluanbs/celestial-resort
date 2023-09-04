import express from 'express';
import request from 'supertest';
import { compare, hash } from '../../../../bin/utils/SecureHash';
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { CreateUserController } from './CreateUserController';
import { CreateUserUseCase } from './CreateUserUseCase';
import { IUser } from '../../../interfaces/IUser';

jest.mock('../../../../bin/utils/SecureHash.ts', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('CreateUserUseCase', () => {
    let useCase: CreateUserUseCase;
    let controller: CreateUserController;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockCompare = jest.fn();
    let mockHash = jest.fn();
    const app = express();
    app.use(express.json());

    beforeEach(() => {
        jest.resetAllMocks();

        (compare as jest.MockedFunction<typeof compare>).mockImplementation(mockCompare);
        (hash as jest.MockedFunction<typeof hash>).mockImplementation(mockHash);

        mockUserRepository = {
            isUserExist: jest.fn(),
            createUser: jest.fn(),
            decreaseUserBalance: jest.fn(),
            getUserDataByEmail: jest.fn(),
            getUserDataById: jest.fn(),
            updateUserBalance: jest.fn(),
            updateUserName: jest.fn(),
        };

        useCase = new CreateUserUseCase(mockUserRepository);
        controller = new CreateUserController(useCase);

        app.post('/user/account', (req, res) => controller.handle(req, res));
    });

    it('should return "User already exists!" if user email is already registered', async () => {
        mockUserRepository.isUserExist.mockResolvedValueOnce(true);
        const user: IUser = {
            id: '31e8db88-fd5a-4aee-bf9a-f43b3dadb3a2',
            user_name: 'John Smith',
            user_balance: 0,
            email_address: 'john@test.com',
            password: 'correct_password'
        };
        const result = await useCase.run(user);
        expect(result).toEqual({ status: 400, success: false, message: "User already exists!" });
    });

    it('should create a user successfully', async () => {
        mockUserRepository.isUserExist.mockResolvedValueOnce(false);
        mockHash.mockResolvedValueOnce('hashed_password');
        const user: IUser = {
            id: '31e8db88-fd5a-4aee-bf9a-f43b3dadb3a2',
            user_name: 'John Smith',
            user_balance: 0,
            email_address: 'john@test.com',
            password: 'correct_password'
        };
        const result = await useCase.run(user);
        expect(result).toEqual({ status: 200, success: true, message: "User created successfully!" });
        expect(mockUserRepository.createUser).toHaveBeenCalled();
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .post('/user/account')
            .send({
                user_name: "John Smith",
                email_address: '',
                password: "1346798520"
            })

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        const response = await request(app)
            .post('/user/account')
            .send({
                user_name: "John Smith",
                email_address: 'john@mail.com',
                password: "1346798520"
            });
        mockUserRepository.isUserExist.mockResolvedValueOnce(false);
        mockHash.mockResolvedValueOnce('hashed_password');
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User created successfully!");
    });
});