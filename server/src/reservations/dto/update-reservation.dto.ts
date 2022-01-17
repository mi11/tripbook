import { ReservationStatus } from './reservation-status.enum';
import { IsEnum, ValidateNested } from 'class-validator';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Type } from 'class-transformer';

export class UpdateReservationDto {
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
