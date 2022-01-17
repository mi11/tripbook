import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trip } from '../../trips/entities/trip.entity';
import { User } from '../../users/entities/user.entity';
import { ReservationStatus } from '../dto/reservation-status.enum';

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trip, (trip) => trip.reservations, { eager: true })
  @JoinColumn()
  trip: Trip;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  users: User[];

  @Column({ name: 'required_seats' })
  requiredSeats: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.ONGOING,
  })
  status: ReservationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
