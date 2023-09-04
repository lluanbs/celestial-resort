import { IUser } from "../../../interfaces/IUser";
export type IUpdateUserBalanceDTO = Pick<IUser, 'id' | 'user_balance'>;