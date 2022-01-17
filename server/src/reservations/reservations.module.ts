import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { UsersModule } from '../users/users.module';
import { TripsModule } from '../trips/trips.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), UsersModule, TripsModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
