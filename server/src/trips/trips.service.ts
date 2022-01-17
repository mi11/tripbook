import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { Between, Equal, MoreThanOrEqual, Repository } from 'typeorm';
import { FindTripDto } from './dto/find-trip.dto';

@Injectable()
export class TripsService {
  constructor(@InjectRepository(Trip) private repo: Repository<Trip>) {}

  create(createTripDto: CreateTripDto) {
    const trip = this.repo.create(createTripDto);

    return this.repo.save(trip);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOne(id);
  }

  find(findTripDto: FindTripDto) {
    return this.repo.find(findTripDto);
  }

  async search({ from, to, departure, availableSeats }: FindTripDto) {
    const startDeparture = new Date(departure);
    startDeparture.setHours(0);
    startDeparture.setMinutes(0);
    startDeparture.setSeconds(0);
    const endDeparture = new Date(startDeparture);
    endDeparture.setDate(startDeparture.getDate() + 1);

    return this.repo.find({
      where: {
        from: Equal(from),
        to: Equal(to),
        departure: Between(
          startDeparture.toISOString(),
          endDeparture.toISOString(),
        ),
        availableSeats: MoreThanOrEqual(availableSeats),
      },
    });
  }

  async removeAvailableSeats(id: number, numberOfSeats: number) {
    const trip = await this.repo.findOne(id);
    return await this.repo.update(id, {
      availableSeats: trip.availableSeats - numberOfSeats,
    });
  }

  async addAvailableSeats(id: number, numberOfSeats: number) {
    const trip = await this.repo.findOne(id);
    return await this.repo.update(id, {
      availableSeats: trip.availableSeats + numberOfSeats,
    });
  }

  async update(id: number, updateTripDto: UpdateTripDto) {
    const trip = await this.findOne(id);
    if (!trip) {
      throw new NotFoundException('trip not found');
    }

    Object.assign(trip, updateTripDto);

    return this.repo.save(trip);
  }

  async remove(id: number) {
    const trip = await this.findOne(id);
    if (!trip) {
      throw new NotFoundException('trip not found');
    }

    return this.repo.remove(trip);
  }
}
