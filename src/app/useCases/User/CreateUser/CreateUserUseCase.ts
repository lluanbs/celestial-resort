import { hash } from "../../../../bin/utils/SecureHash";
import { User } from "../../../entities/User";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { CreateUserDTO } from "./CreateUserDTO";

export class CreateUserUseCase {

    constructor(private userRepository: IUserRepository) { };

    public async run(data: CreateUserDTO) {
        if (await this.isUserExist(data.email_address)) return { status: 400, success: false, message: "User already exists!" };
        await this.userRepository.createUser(new User({ ...data, user_balance: 0, password: await hash(data.password) }));
        return { status: 200, success: true, message: "User created successfully!" };
    };

    private async isUserExist(user_id: string) {
        return this.userRepository.isUserExist(user_id);
    };
};