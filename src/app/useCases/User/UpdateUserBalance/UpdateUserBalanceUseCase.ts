import { IUserRepository } from "../../../interfaces/IUserRepository";
import { IUpdateUserBalanceDTO } from "./IUpdateUserBalanceDTO";

export class UpdateUserBalanceUseCase {

    constructor(private userRepository: IUserRepository) { };

    public async run(data: IUpdateUserBalanceDTO) {
        const isUserExists = await this.userRepository.getUserDataById(data.id);
        if (!isUserExists) return { status: 400, success: false, message: "User not found!" };
        await this.userRepository.updateUserBalance(data.id, data.user_balance);
        return { status: 200, success: true, message: "User balance successfully updated!" };
    };
};