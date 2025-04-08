import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './payment-method.entity';
import { paymentStatus } from 'src/transactions/enums/payment-status.enum';

@Entity()
export class PaymentIntent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: paymentStatus,
    default: paymentStatus.PENDING,
  })
  status: paymentStatus;

  @Column({
    name: 'stripe_payment_intent_id',
    unique: true,
  })
  stripePaymentIntentId: string;

  @ManyToMany(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentIntents,
    {
      cascade: true,
    },
  )
  @JoinTable({ name: 'payment_method_intent' })
  paymentMethods: PaymentMethod[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
