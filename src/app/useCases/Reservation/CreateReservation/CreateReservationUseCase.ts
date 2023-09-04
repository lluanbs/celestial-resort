import DateConvertDMY from "../../../../bin/utils/DateConvertDMY";
import FormatCurrencyLocale from "../../../../bin/utils/FormatCurrencyLocale";
import GenerateReservationPDF from "../../../../bin/utils/GenerateReservationPDF";
import { Reservation } from "../../../entities/Reservation";
import { ReservationStatus } from "../../../interfaces/IReservation";
import { IReservationRepository } from "../../../interfaces/IReservationRepository";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { RoomRepository } from "../../../repositories/RoomRepository";
import { CreateReservationDTO } from "./CreateReservationDTO";

export class CreateReservationUseCase {

    constructor(private reservationRepository: IReservationRepository, private userRepository: IUserRepository, private roomRepository: RoomRepository) { };

    public async run(data: CreateReservationDTO) {
        if (!await this.userRepository.isUserExist(data.user_id)) return { status: 400, success: false, message: "User not exists!" };

        if (!await this.roomRepository.isRoomIdsExists(data.rooms)) return { status: 400, success: false, message: "Invalid rooms IDs!" };

        if (await this.reservationRepository.isRoomsOccupied(data.rooms)) return { status: 400, success: false, message: "Rooms not available!" };

        const totalPriceRooms = await this.roomRepository.getPriceBySelectedRoomIds(data.rooms);
        if (!totalPriceRooms) return { status: 400, success: false, message: "Rooms prices not available!" };

        const roomsNumbers = await this.roomRepository.getRoomsNumbersByRoomIds(data.rooms);
        if (!roomsNumbers) return { status: 400, success: false, message: "Rooms numbers not available!" };

        const reservationData = await this.reservationRepository.createReservation(new Reservation({ ...data, status: ReservationStatus.PENDING, reservation_price: totalPriceRooms }));

        await GenerateReservationPDF({
            id: reservationData.id,
            user_name: reservationData.user_name,
            check_in_date: DateConvertDMY(reservationData.check_in_date),
            check_out_date: DateConvertDMY(reservationData.check_out_date),
            rooms_numbers: roomsNumbers.map(room => room.room_number).join(', '),
            total_price: FormatCurrencyLocale(totalPriceRooms)
        });

        return { status: 200, success: true, message: "Reservation created successfully!", data: reservationData };
    };
};