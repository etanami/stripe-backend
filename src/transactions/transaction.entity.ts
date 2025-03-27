import { PaymentMethod } from 'src/payments/payment-method.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { paymentStatus } from './enums/payment-status.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;

  @ManyToOne(() => PaymentMethod, (paymentMethod) => paymentMethod.transactions)
  paymentMethod: PaymentMethod;

  @Column({
    type: 'decimal',
    nullable: false,
  })
  amount: number;

  @Column({
    unique: true,
    name: 'stripe_transaction_id',
  })
  stripeTransactionId: string;

  @Column({
    type: 'enum',
    enum: paymentStatus,
    default: paymentStatus.SUCCESSFUL,
    nullable: false,
    name: 'payment_status',
  })
  paymentStatus: paymentStatus;

  @CreateDateColumn()
  created_at: Date;
}
