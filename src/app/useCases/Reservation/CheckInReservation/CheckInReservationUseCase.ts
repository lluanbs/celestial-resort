import { ReservationStatus } from "../../../interfaces/IReservation";
import { IReservationRepository } from "../../../interfaces/IReservationRepository";
import { IUserRepository } from "../../../interfaces/IUserRepository";
import { CheckInReservationDTO } from "./CheckInReservationDTO";

export class CheckInReservationUseCase {

    constructor(private reservationRepository: IReservationRepository, private userRepository: IUserRepository) { };

    public async run(data: CheckInReservationDTO) {
        const reservationData = await this.reservationRepository.getReservation(data.id);
        if (!reservationData) return { status: 400, success: false, message: "Reservation not found!" };
        if (reservationData.status == ReservationStatus.COMPLETED) return { status: 400, success: false, message: "Reservation already used!" };
        if (reservationData.status == ReservationStatus.CHECKED_IN) return { status: 400, success: false, message: "Reservation already checked in!" };
        if (reservationData.status == ReservationStatus.CHECKED_OUT) return { status: 400, success: false, message: "Reservation already checked out!" };
        if (reservationData.status == ReservationStatus.REJECTED) return { status: 400, success: false, message: "Reservation rejected!" };
        if (reservationData.status != ReservationStatus.ACTIVE) return { status: 402, success: false, message: "The payment for the reservation is pending or was not successful!" };
        const userData = await this.userRepository.getUserDataById(reservationData.user_id);
        if (!userData) return { status: 400, success: false, message: "User not found!" };

        if (reservationData.reservation_price > userData.user_balance) return { status: 400, success: false, message: "User don't have enough cash balance!" };
        await this.userRepository.decreaseUserBalance(reservationData?.user_id, reservationData.reservation_price);
        await this.reservationRepository.updateReservationStatus(reservationData.id, ReservationStatus.CHECKED_IN);
        return { status: 200, success: true, message: "Check-in confirmed successfully" };
    };
};