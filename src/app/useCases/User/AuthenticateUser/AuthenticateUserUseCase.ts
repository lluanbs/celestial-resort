import { compare } from '../../../../bin/utils/SecureHash';
import { IUserRepository } from "../../../interfaces/IUserRepository";
import GenerateJWTAccessTokenProvider from '../../../providers/GenerateJWTAccessTokenProvider';
import { AuthenticateUserDTO } from "./AuthenticateUserDTO";

export class AuthenticateUserUseCase {

    constructor(private userRepository: IUserRepository) { };

    public async run(data: AuthenticateUserDTO) {
        const hasUserData = await this.userRepository.getUserDataByEmail(data.email_address);
        if (!hasUserData) return { status: 400, message: "User not found!" };

        const isUserPassMatch = await compare(data.password, hasUserData.password);
        if (!isUserPassMatch) return { status: 400, message: "Password mismatch!" };

        const generateJWTAccessTokenProviderResponse = GenerateJWTAccessTokenProvider(hasUserData.id);
        const responseData = {
            user_id: hasUserData.id,
            user_name: hasUserData.user_name,
            access_token: generateJWTAccessTokenProviderResponse.accessToken,
            expires_in: generateJWTAccessTokenProviderResponse.expiresIn
        };

        return { status: 200, success: true, message: "User successfully authenticated!", data: responseData };
    };
};