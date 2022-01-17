import { PartialType } from '@nestjs/mapped-types';
import { CreateTripDto } from './create-trip.dto';

export class FindTripDto extends PartialType(CreateTripDto) {}
