import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { TripsService } from '../trips/trips.service';
import { ReservationStatus } from './dto/reservation-status.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation) private repo: Repository<Reservation>,
    private readonly tripsService: TripsService,
    private readonly usersService: UsersService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    const trip = await this.tripsService.findOne(createReservationDto.tripId);
    if (!trip) {
      throw new NotFoundException('trip is not exist');
    }

    const reservation = new Reservation();
    reservation.trip = trip;
    reservation.users = [];
    reservation.requiredSeats = createReservationDto.requiredSeats;
    reservation.status = ReservationStatus.ONGOING;

    await this.tripsService.removeAvailableSeats(
      trip.id,
      createReservationDto.requiredSeats,
    );

    setTimeout(async () => {
      await this.cancel(reservation.id);
    }, 300000);

    return this.repo.save(reservation);
  }

  async cancel(id: number) {
    const reservation = await this.repo.findOne(id);
    if (reservation && reservation.status === ReservationStatus.ONGOING) {
      await this.tripsService.addAvailableSeats(
        reservation.trip.id,
        reservation.requiredSeats,
      );

      Object.assign(reservation, {
        status: ReservationStatus.CANCELED,
      });

      return this.repo.save(reservation);
    }
  }

  async confirm(id: number, updateReservationDto: UpdateReservationDto) {
    const reservation = await this.repo.findOne(id);

    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    const users = [];
    for (const userDto of updateReservationDto.users) {
      const user = await this.usersService.createIfNotExist(userDto);
      users.push(user);
    }

    if (reservation.requiredSeats !== users.length) {
      throw new BadRequestException('insufficient passenger data provided');
    }

    Object.assign(reservation, {
      status: updateReservationDto.status,
      users,
    });

    return await this.repo.save(reservation);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    if (!reservation) {
      throw new NotFoundException('reservation not found');
    }

    return this.repo.remove(reservation);
  }
}
