import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrivChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client1: string;

  @Column()
  client2: string;

  @Column()
  messages: string[];
}