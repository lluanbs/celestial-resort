import { IRoom } from "../../../interfaces/IRoom";

export type CreateRoomDTO = Omit<IRoom, 'id'>;