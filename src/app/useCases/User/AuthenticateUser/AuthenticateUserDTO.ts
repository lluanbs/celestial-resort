import { IUser } from "../../../interfaces/IUser";
export type AuthenticateUserDTO = Pick<IUser, 'email_address' | 'password'>;