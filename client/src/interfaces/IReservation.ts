import { IUser } from "./IUser";

export interface IReservation {
  id: number;
  tripId: number;
  users: IUser[];
  requiredSeats: number;
  status: string;
}
