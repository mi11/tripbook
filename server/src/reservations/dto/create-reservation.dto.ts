import { IsNumber, Min } from 'class-validator';

export class CreateReservationDto {
  @IsNumber()
  tripId: number;

  @IsNumber()
  @Min(1)
  requiredSeats: number;
}
