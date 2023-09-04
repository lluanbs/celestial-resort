import { ReservationStatus } from "../../../interfaces/IReservation";
import { IReservationRepository } from "../../../interfaces/IReservationRepository";
import { ConfirmReservationDTO } from "./ConfirmReservationDTO";

export class ConfirmReservationUseCase {

    constructor(private reservationRepository: IReservationRepository) { };

    public async run(data: ConfirmReservationDTO) {
        const reservationData = await this.reservationRepository.getReservation(data.id);
        if (!reservationData) return { status: 400, success: false, message: "Reservation not found!" };
        if (reservationData.status === ReservationStatus.ACTIVE) return { status: 200, success: true, message: "Reservation already confirmed!" };
        await this.reservationRepository.updateReservationStatus(data.id, ReservationStatus.ACTIVE);
        return { status: 200, success: true, message: "Reservation confirmed successfully!" };
    };
};