import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity({ name: 'trips' })
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  departure: Date;

  @Column()
  arrival: Date;

  @Column({ name: 'total_seats' })
  totalSeats: number;

  @Column({ name: 'available_seats', default: 0 })
  availableSeats: number;

  @Column()
  price: number;

  @OneToMany(() => Reservation, (reservation) => reservation.trip)
  reservations: Reservation[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
