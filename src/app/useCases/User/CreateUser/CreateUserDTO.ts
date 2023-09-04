import { IUser } from "../../../interfaces/IUser";
export type CreateUserDTO = Omit<IUser, 'id' | 'user_balance'>;