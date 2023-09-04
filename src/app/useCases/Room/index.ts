import { RoomRepository } from "../../repositories/RoomRepository";
import { CreateRoomController } from "./CreateRoom/CreateRoomController";
import { CreateRoomUseCase } from "./CreateRoom/CreateRoomUseCase";
const roomRepository = new RoomRepository();
export const createRoomUseCase = new CreateRoomUseCase(roomRepository);
export const createRoomController = new CreateRoomController(createRoomUseCase);