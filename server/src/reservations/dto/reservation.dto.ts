import { Expose, Transform } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { ReservationStatus } from './reservation-status.enum';

export class ReservationDto {
  @Expose()
  id: number;

  @Transform(({ obj }) => obj.trip.id)
  @Expose()
  tripId: number;

  @Expose()
  users: User[];

  @Expose()
  requiredSeats: number;

  @Expose()
  status: ReservationStatus;
}
