import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AllChat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  owner: string;

  @Column()
  clients: string[];

  @Column()
  messages: string[];

  @Column()
  pass: string;

  @Column()
  admins: string[];
}
