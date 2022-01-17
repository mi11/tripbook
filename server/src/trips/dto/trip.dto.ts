import { Expose } from 'class-transformer';

export class TripDto {
  @Expose()
  id: number;

  @Expose()
  from: string;

  @Expose()
  to: string;

  @Expose()
  departure: Date;

  @Expose()
  arrival: Date;

  @Expose()
  totalSeats: number;

  @Expose()
  availableSeats: number;

  @Expose()
  price: number;
}
