import { IsString, Min, IsNumber, IsDateString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsDateString()
  departure: Date;

  @IsDateString()
  arrival: Date;

  @IsNumber()
  @Min(0)
  totalSeats: number;

  @IsNumber()
  @Min(0)
  availableSeats: number;

  @IsNumber()
  @Min(0)
  price: number;
}
