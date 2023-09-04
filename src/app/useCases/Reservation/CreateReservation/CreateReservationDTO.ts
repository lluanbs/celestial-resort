import { IReservation } from "../../../interfaces/IReservation";
export type CreateReservationDTO = Omit<IReservation, 'id'>;