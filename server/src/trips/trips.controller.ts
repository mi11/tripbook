import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AdminGuard } from '../guards/admin.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { TripDto } from './dto/trip.dto';
import { FindTripDto } from './dto/find-trip.dto';

@Controller('trips')
@Serialize(TripDto)
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  findAll() {
    return this.tripsService.findAll();
  }

  @Post('/find')
  find(@Body() findTripDto: FindTripDto) {
    return this.tripsService.search(findTripDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripsService.update(+id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.tripsService.remove(+id);
  }
}
