import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LinkPrecedence } from './constants';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column('varchar', { length: 255, nullable: true })
  phoneNumber?: string;

  @Index()
  @Column('varchar', { nullable: true })
  email?: string;

  @ManyToOne(() => Contact)
  linkedId?: number;

  @Column({
    type: 'enum',
    enum: LinkPrecedence,
    default: LinkPrecedence.PRIMARY,
  })
  linkPrecedence: LinkPrecedence;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
