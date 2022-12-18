import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Quote } from '../quote/quote.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'boolean' })
  public signed: boolean;

  @OneToOne(() => Quote)
  @JoinColumn()
  public quote: Quote;

  /*
   * Create and Update Date Columns
   */

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
