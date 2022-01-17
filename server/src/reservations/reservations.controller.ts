import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationStatus } from './dto/reservation-status.enum';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReservationDto } from './dto/reservation.dto';

@Controller('reservations')
@Serialize(ReservationDto)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    switch (updateReservationDto.status) {
      case ReservationStatus.COMPLETED:
        return this.reservationsService.confirm(+id, updateReservationDto);
      case ReservationStatus.CANCELED:
        return this.reservationsService.cancel(+id);
      default:
        throw new BadRequestException('status is not updated');
    }
  }

  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
