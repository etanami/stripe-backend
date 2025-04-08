import { Transaction } from 'src/transactions/transaction.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { PaymentIntent } from './payment-intent.entity';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    name: 'stripe_payment_method_id',
  })
  stripePaymentMethodId: string;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(
    () => PaymentIntent,
    (paymentIntent) => paymentIntent.paymentMethods,
  )
  paymentIntents: PaymentIntent[];

  @OneToMany(() => Transaction, (transaction) => transaction.paymentMethod)
  transactions: Transaction[];
}
