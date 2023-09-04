import SearchDirectoryPath from "../../../../bin/utils/SearchDirectoryPath";
import { IReservationRepository } from "../../../interfaces/IReservationRepository";
import { DownloadReservationDTO } from "./DownloadReservationDTO";

export class DownloadReservationUseCase {

    constructor(private reservationRepository: IReservationRepository) { };

    public async run(data: DownloadReservationDTO) {
        const filePath = SearchDirectoryPath('./download/', data.id + '.pdf');
        if (!filePath) return { status: 400, success: true, message: "Reservation confirmation not found!" };
        return { status: 200, success: true, message: "Reservation downloaded successfully!", data: filePath };
    };
};