import express from 'express';
import request from 'supertest';
import { compare, hash } from '../../../../bin/utils/SecureHash';
import { IUser } from '../../../interfaces/IUser';
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { AuthenticateUserController } from "./AuthenticateUserController";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

jest.mock('../../../providers/GenerateJWTAccessTokenProvider', () => {
    return () => ({
        accessToken: 'mocked_token',
        expiresIn: '1h'
    });
});

jest.mock('../../../../bin/utils/SecureHash.ts', () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

describe('AuthenticateUserUseCase', () => {
    let useCase: AuthenticateUserUseCase;
    let controller: AuthenticateUserController;
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

        useCase = new AuthenticateUserUseCase(mockUserRepository);
        controller = new AuthenticateUserController(useCase);

        app.post('/user/authenticate', (req, res) => controller.handle(req, res));
    });

    it('should return user not found if email does not exist', async () => {
        mockUserRepository.isUserExist.mockImplementation(() => Promise.resolve(false));

        const result = await useCase.run({ email_address: 'notfound@test.com', password: 'any_pass' });
        expect(result).toEqual({ status: 400, message: "User not found!" });
    });

    it('should return password mismatch if password does not match', async () => {
        const stockedUser: IUser = {
            id: 'b9a71a6a-cb94-49ee-8610-6505f8697bf8',
            user_name: 'John Doe',
            email_address: 'user@test.com',
            password: "correct_password",
            user_balance: 6000
        };

        mockUserRepository.getUserDataByEmail.mockResolvedValueOnce(stockedUser);
        mockCompare.mockReturnValue(false);

        const result = await useCase.run({ email_address: 'user@test.com', password: 'wrong_password' });
        expect(result).toEqual({ status: 400, message: "Password mismatch!" });
    });

    it('should return success and token if email and password are correct', async () => {
        const stockedUser: IUser = {
            id: 'b9a71a6a-cb94-49ee-8610-6505f8697bf8',
            user_name: 'John Doe',
            email_address: 'user@test.com',
            password: "correct_password",
            user_balance: 6000
        };

        mockUserRepository.getUserDataByEmail.mockResolvedValueOnce(stockedUser);
        mockCompare.mockResolvedValueOnce(true);
        const result = await useCase.run({ email_address: 'user@test.com', password: 'correct_password' });
        expect(result).toEqual({
            status: 200,
            success: true,
            message: "User successfully authenticated!",
            data: {
                user_id: 'b9a71a6a-cb94-49ee-8610-6505f8697bf8',
                user_name: 'John Doe',
                access_token: 'mocked_token',
                expires_in: '1h'
            }
        });
    });

    it('should return 400 for invalid body', async () => {
        const response = await request(app)
            .post('/user/authenticate')
            .field('email_address', '')
            .field('password', 'correct_password');

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Some fields are invalid!');
    });

    it('should return 200 for valid body', async () => {
        const stockedUser: IUser = {
            id: 'b9a71a6a-cb94-49ee-8610-6505f8697bf8',
            user_name: 'John Doe',
            email_address: 'user@test.com',
            password: "correct_password",
            user_balance: 6000
        };
        mockUserRepository.getUserDataByEmail.mockResolvedValueOnce(stockedUser);
        mockCompare.mockResolvedValueOnce(true);
        const response = await request(app)
            .post('/user/authenticate')
            .send({
                email_address: "user@test.com",
                password: "correct_password",
            });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User successfully authenticated!");
    });
});