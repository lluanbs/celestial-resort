import { Room } from "../../../entities/Room";
import { IRoomRepository } from "../../../interfaces/IRoomRepository";
import { CreateRoomDTO } from "./CreateRoomDTO";

export class CreateRoomUseCase {

    constructor(private roomRepository: IRoomRepository) { };

    public async run(data: CreateRoomDTO) {
        if (await this.isRoomExistsByNumber(data.room_number)) return { status: 400, success: false, message: "Room already exists!" };
        await this.roomRepository.createRoom(new Room(data));
        return { status: 200, success: true, message: "Room created successfully!" };
    };

    private async isRoomExistsByNumber(room_id: string) {
        return await this.roomRepository.isRoomExistsByNumber(room_id);
    };
};