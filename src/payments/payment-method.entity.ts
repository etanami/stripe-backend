import { Transaction } from 'src/transactions/transaction.entity';
import { User } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.paymentMethods)
  user: User;

  @Column()
  stripePaymentMethodId: string;

  @OneToMany(() => Transaction, (transaction) => transaction.paymentMethod)
  transactions: Transaction[];
}
