import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentMethod } from './payment-method.entity';

@Entity()
export class PaymentIntent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    name: 'stripe_payment_intent_id',
    unique: true,
  })
  stripePaymentIntentId: string;

  @ManyToMany(
    () => PaymentMethod,
    (paymentMethod) => paymentMethod.paymentIntents,
  )
  paymentMethods: PaymentMethod[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
